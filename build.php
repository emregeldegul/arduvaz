<?php
/**
 * Arduvaz theme builder.
 *
 * Builds dist/arduvaz-theme.xml from templates/*.html and css/*.css,
 * imports it into MyBB (updating the existing theme in place) and
 * sets it as the default theme.
 *
 * Usage (inside the container): php /var/www/theme/build.php [--no-import]
 */

if(PHP_SAPI !== 'cli')
{
	exit("CLI only.\n");
}

define('IN_MYBB', 1);
define('IN_ADMINCP', 1);
define('THEME_DIR', __DIR__);
define('MYBB_ROOT', '/var/www/html/');

require_once MYBB_ROOT.'inc/init.php';
require_once MYBB_ROOT.'admin/inc/functions.php';
require_once MYBB_ROOT.'admin/inc/functions_themes.php';

$config_file = THEME_DIR.'/theme.json';
$theme_config = json_decode(file_get_contents($config_file), true);
if(!is_array($theme_config))
{
	fail("theme.json is not valid JSON.");
}

$name = $theme_config['name'];
$version = $mybb->version_code;

// Templates: every templates/<name>.html becomes template <name>
$templates = array();
foreach(glob(THEME_DIR.'/templates/*.html') as $file)
{
	$templates[basename($file, '.html')] = rtrim(file_get_contents($file), "\r\n");
}
ksort($templates);

// Stylesheets: listed in theme.json, in display order
$stylesheets = array();
foreach($theme_config['stylesheets'] as $order => $sheet)
{
	$path = THEME_DIR.'/css/'.$sheet['file'];
	if(!is_file($path))
	{
		fail("Missing stylesheet: css/{$sheet['file']}");
	}
	$stylesheets[] = array(
		'name' => $sheet['file'],
		'attachedto' => isset($sheet['attachedto']) ? $sheet['attachedto'] : '',
		'disporder' => $order + 1,
		'value' => rtrim(file_get_contents($path), "\r\n")
	);
}

// Master stylesheets we do not use: overridden by name and attached to no page,
// so MyBB never links them. (A theme cannot remove an inherited stylesheet.)
$disabled = isset($theme_config['disabled_stylesheets']) ? $theme_config['disabled_stylesheets'] : array();
foreach($disabled as $sheet_name)
{
	$stylesheets[] = array(
		'name' => $sheet_name,
		'attachedto' => 'arduvaz_disabled',
		'disporder' => count($stylesheets) + 1,
		'value' => "/* Disabled by the {$theme_config['name']} theme. */"
	);
}

// Template set (created once, kept across builds)
$query = $db->simple_select('templatesets', 'sid', "title='".$db->escape_string($name." Templates")."'", array('limit' => 1));
$sid = (int)$db->fetch_field($query, 'sid');
if(!$sid)
{
	$sid = (int)$db->insert_query('templatesets', array('title' => $db->escape_string($name." Templates")));
}

$properties = $theme_config['properties'];
$properties['templateset'] = $sid;

// Build XML
$xml = "<?xml version=\"1.0\" encoding=\"UTF-8\"?>\n";
$xml .= "<theme name=\"".xml_attr($name)."\" version=\"{$version}\">\n";
$xml .= "\t<properties>\n";
foreach($properties as $key => $value)
{
	$xml .= "\t\t<{$key}>".cdata($value)."</{$key}>\n";
}
$xml .= "\t</properties>\n";
$xml .= "\t<stylesheets>\n";
foreach($stylesheets as $sheet)
{
	$attached = $sheet['attachedto'] !== '' ? " attachedto=\"".xml_attr($sheet['attachedto'])."\"" : '';
	$xml .= "\t\t<stylesheet name=\"".xml_attr($sheet['name'])."\"{$attached} version=\"{$version}\" disporder=\"{$sheet['disporder']}\">".cdata($sheet['value'])."</stylesheet>\n";
}
$xml .= "\t</stylesheets>\n";
$xml .= "\t<templates>\n";
foreach($templates as $title => $template)
{
	$xml .= "\t\t<template name=\"".xml_attr($title)."\" version=\"{$version}\">".cdata($template)."</template>\n";
}
$xml .= "\t</templates>\n";
$xml .= "</theme>\n";

$dist = THEME_DIR.'/dist/arduvaz-theme.xml';
file_put_contents($dist, $xml);
echo "Built {$dist} (".count($templates)." templates, ".count($stylesheets)." stylesheets)\n";

if(in_array('--no-import', $argv))
{
	exit(0);
}

// Replace this theme's templates with the current set
$db->delete_query('templates', "sid='{$sid}'");

$tid = import_theme_xml($xml, array(
	'templateset' => $sid,
	'version_compat' => 1,
	'parent' => (int)$theme_config['parent'],
));

if($tid < 0)
{
	fail("Import failed (code {$tid}).");
}

// Stylesheet load order: ours as listed in theme.json, then the inherited ones.
// (On re-import MyBB numbers inherited sheets first, which would load global.css last.)
$theme = $db->fetch_array($db->simple_select('themes', 'properties', "tid='{$tid}'"));
$theme_properties = my_unserialize($theme['properties']);
$disporder = array();
foreach($stylesheets as $sheet)
{
	$disporder[$sheet['name']] = count($disporder) + 1;
}
asort($theme_properties['disporder']);
foreach(array_keys($theme_properties['disporder']) as $sheet_name)
{
	if(!isset($disporder[$sheet_name]))
	{
		$disporder[$sheet_name] = count($disporder) + 1;
	}
}
$theme_properties['disporder'] = $disporder;
$db->update_query('themes', array('properties' => $db->escape_string(my_serialize($theme_properties))), "tid='{$tid}'");
update_theme_stylesheet_list($tid, false, false);

// Set as default theme
$theme = $db->fetch_array($db->simple_select('themes', '*', "tid='{$tid}'"));
$db->update_query('themes', array('def' => 0));
$db->update_query('themes', array('def' => 1), "tid='{$tid}'");
$cache->update('default_theme', $theme);

echo "Imported theme \"{$name}\" (tid {$tid}, template set {$sid}) and set it as default.\n";

function cdata($value)
{
	return '<![CDATA['.str_replace(']]>', ']]]]><![CDATA[>', $value).']]>';
}

function xml_attr($value)
{
	return htmlspecialchars($value, ENT_QUOTES | ENT_XML1, 'UTF-8');
}

function fail($message)
{
	fwrite(STDERR, $message."\n");
	exit(1);
}
