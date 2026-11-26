<?php
/**
 * Arduvaz — Admin CP style
 * Arduvaz theme for MyBB — (c) 2026 MyBB.tr — https://mybb.tr
 *
 * Görünümün tamamı CSS'tedir. Bu dosya yalnızca mobil uyum için
 * <head> içine viewport meta etiketini ekler; çıktı başka hiçbir
 * şekilde değiştirilmez.
 */

// Disallow direct access to this file for security reasons
if(!defined("IN_MYBB"))
{
	die("Direct initialization of this file is not allowed.<br /><br />Please make sure IN_MYBB is defined.");
}

class Page extends DefaultPage
{
	const VIEWPORT = '<meta name="viewport" content="width=device-width, initial-scale=1" />';

	function output_header($title="")
	{
		// Bazı modüller extra_header'ı "=" ile atadığı için çağrı anında eklenir
		$this->extra_header .= "\t".self::VIEWPORT."\n";
		parent::output_header($title);
	}

	// Giriş / 2FA / kilit sayfaları kendi <head>'ini yazar ve exit ile biter;
	// çıktı tamponun geri çağrısında etiket eklenir.
	function show_login($message="", $class="success")
	{
		ob_start(array($this, 'add_viewport'));
		parent::show_login($message, $class);
	}

	function show_2fa()
	{
		ob_start(array($this, 'add_viewport'));
		parent::show_2fa();
	}

	function show_lockedout()
	{
		ob_start(array($this, 'add_viewport'));
		parent::show_lockedout();
	}

	function show_lockout_unlock($message="", $class="success")
	{
		ob_start(array($this, 'add_viewport'));
		parent::show_lockout_unlock($message, $class);
	}

	function add_viewport($html)
	{
		return preg_replace('/<head[^>]*>/i', "$0\n".self::VIEWPORT, $html, 1);
	}
}
