/*! Arduvaz theme for MyBB — (c) 2026 MyBB.tr — https://mybb.tr
 * Licensed under the Arduvaz Theme License (LICENSE.md). The footer credit link must stay visible. */
/**
 * Arduvaz theme for MyBB — interface behaviour.
 * Plain JavaScript; MyBB's own features (modals, popups, inline moderation ...)
 * stay on MyBB's jQuery scripts.
 */
(function () {
	"use strict";

	// TODO:lang — texts with no MyBB language variable
	var TEXT = {
		copy: "Copy",
		copied: "Copied"
	};

	var iconSprite = (window.imagepath || "images/arduvaz") + "/icons.svg";

	function swapIcon(button, name) {
		var use = button.querySelector("use");
		if (use) {
			use.setAttribute("href", use.getAttribute("href").replace(/#.*$/, "#" + name));
		}
	}

	/* ---------- Dropdowns ---------- */
	function closeDropdowns(except) {
		document.querySelectorAll(".dropdown.open").forEach(function (dropdown) {
			if (dropdown === except) {
				return;
			}
			dropdown.classList.remove("open");
			var trigger = dropdown.querySelector("[data-dropdown]");
			if (trigger) {
				trigger.setAttribute("aria-expanded", "false");
			}
		});
	}

	document.addEventListener("click", function (event) {
		var trigger = event.target.closest("[data-dropdown]");
		if (!trigger) {
			if (!event.target.closest(".dropdown-menu")) {
				closeDropdowns(null);
			}
			return;
		}

		event.preventDefault();
		var dropdown = trigger.closest(".dropdown");
		var isOpen = dropdown.classList.contains("open");
		closeDropdowns(dropdown);
		dropdown.classList.toggle("open", !isOpen);
		trigger.setAttribute("aria-expanded", String(!isOpen));

		if (!isOpen) {
			// Open upwards when the menu would overflow the viewport
			var menu = dropdown.querySelector(".dropdown-menu");
			menu.style.top = "";
			menu.style.bottom = "";
			var rect = menu.getBoundingClientRect();
			if (rect.bottom > window.innerHeight - 8 && dropdown.getBoundingClientRect().top > rect.height + 16) {
				menu.style.top = "auto";
				menu.style.bottom = "calc(100% + 6px)";
			}
		}
	});

	/* ---------- Quick search panel ---------- */
	var searchPanel = document.getElementById("searchPanel");
	var searchToggle = document.getElementById("searchToggle");

	function setSearch(open) {
		if (!searchPanel) {
			return;
		}
		searchPanel.hidden = !open;
		searchToggle.setAttribute("aria-expanded", String(open));
		if (open) {
			document.getElementById("searchInput").focus();
		}
	}

	if (searchPanel && searchToggle) {
		searchToggle.addEventListener("click", function () {
			setSearch(searchPanel.hidden);
		});
		document.getElementById("searchClose").addEventListener("click", function () {
			setSearch(false);
			searchToggle.focus();
		});
	}

	/* ---------- Escape closes open menus ---------- */
	document.addEventListener("keydown", function (event) {
		if (event.key !== "Escape") {
			return;
		}
		var openTrigger = document.querySelector(".dropdown.open [data-dropdown]");
		closeDropdowns(null);
		if (openTrigger) {
			openTrigger.focus();
		}
		if (searchPanel && !searchPanel.hidden) {
			setSearch(false);
			searchToggle.focus();
		}
	});

	/* ---------- Main navigation ---------- */
	var nav = document.getElementById("mainNav");
	var navToggle = document.getElementById("navToggle");

	if (nav && navToggle) {
		navToggle.addEventListener("click", function () {
			var open = nav.classList.toggle("open");
			navToggle.setAttribute("aria-expanded", String(open));
			swapIcon(navToggle, open ? "i-close" : "i-menu");
		});

		// Mark the link of the current page as active
		var page = location.pathname.split("/").pop() || "index.php";
		nav.querySelectorAll("a").forEach(function (link) {
			if (link.pathname.split("/").pop() === page) {
				link.classList.add("active");
				link.setAttribute("aria-current", "page");
			}
		});
	}

	/* ---------- User CP menu: mark the current page ---------- */
	/* 1) A link listing the current action in data-also (e.g. Announcements →
	      delete_announcement). After a POST the URL has no ?action=, so the
	      form's hidden action field is used instead.
	   2) Exact URL.
	   3) Same page and ?action= (e.g. modqueue&type=posts → Moderation Queue). */
	var currentUrl = location.href.split("#")[0];
	var menuLinks = Array.prototype.slice.call(document.querySelectorAll(".ucp-links a"));
	var urlAction = new URL(currentUrl).searchParams.get("action");
	var currentActions = urlAction ? [urlAction] : Array.prototype.map.call(
		document.querySelectorAll('form input[type="hidden"][name="action"]'),
		function (input) { return input.value; }
	);
	var pageKey = function (url) {
		return url.pathname.split("/").pop() + "?" + (url.searchParams.get("action") || "");
	};
	var activeLink = menuLinks.filter(function (link) {
			var also = (link.getAttribute("data-also") || "").split(" ");
			return currentActions.some(function (action) { return action && also.indexOf(action) !== -1; });
		})[0] ||
		menuLinks.filter(function (link) { return link.href === currentUrl; })[0] ||
		menuLinks.filter(function (link) { return pageKey(new URL(link.href)) === pageKey(new URL(currentUrl)); })[0];
	if (activeLink) {
		activeLink.classList.add("is-active");
		activeLink.setAttribute("aria-current", "page");
	}

	/* ---------- Number formatting ([data-number]) ---------- */
	var locale = document.documentElement.lang || undefined;
	document.querySelectorAll("[data-number]").forEach(function (element) {
		var value = Number(element.textContent.trim());
		if (!isNaN(value)) {
			element.textContent = value.toLocaleString(locale);
		}
	});

	/* ---------- Tabs ([data-tabs] > [role="tab"][aria-controls]) ----------
	   Without JavaScript every panel stays visible. A tab whose panel has no
	   content (e.g. staff tools for regular members) is hidden. */
	document.querySelectorAll("[data-tabs]").forEach(function (nav) {
		var tabs = Array.prototype.filter.call(nav.querySelectorAll('[role="tab"]'), function (tab) {
			var panel = document.getElementById(tab.getAttribute("aria-controls"));
			if (!panel || !panel.querySelector(".panel")) {
				tab.hidden = true;
				return false;
			}
			return true;
		});

		function select(selected) {
			tabs.forEach(function (tab) {
				var active = tab === selected;
				tab.setAttribute("aria-selected", String(active));
				tab.tabIndex = active ? 0 : -1;
				document.getElementById(tab.getAttribute("aria-controls")).hidden = !active;
			});
		}

		tabs.forEach(function (tab) {
			tab.addEventListener("click", function () {
				select(tab);
			});
		});

		nav.addEventListener("keydown", function (event) {
			if (event.key !== "ArrowRight" && event.key !== "ArrowLeft") {
				return;
			}
			var index = tabs.indexOf(document.activeElement);
			if (index < 0) {
				return;
			}
			var next = tabs[(index + (event.key === "ArrowRight" ? 1 : -1) + tabs.length) % tabs.length];
			select(next);
			next.focus();
		});

		var initial = tabs.filter(function (tab) {
			return location.hash === "#" + tab.getAttribute("aria-controls");
		})[0] || tabs[0];
		if (initial) {
			select(initial);
		}
	});

	/* ---------- Password fields ---------- */
	// Show / hide toggle: <button data-reveal="inputId">
	document.querySelectorAll("[data-reveal]").forEach(function (button) {
		var input = document.getElementById(button.getAttribute("data-reveal"));
		if (!input) {
			return;
		}
		button.addEventListener("click", function () {
			var show = input.type === "password";
			input.type = show ? "text" : "password";
			button.setAttribute("aria-pressed", String(show));
			swapIcon(button, show ? "i-eye-off" : "i-eye");
		});
	});

	// Strength meter: <input data-strength="meterId">, meter gets data-level 0–4
	document.querySelectorAll("[data-strength]").forEach(function (input) {
		var meter = document.getElementById(input.getAttribute("data-strength"));
		if (!meter) {
			return;
		}
		input.addEventListener("input", function () {
			var value = input.value;
			var level = 0;
			if (value.length) {
				level = 1;
				if (value.length >= 8) { level++; }
				if (/[a-z]/.test(value) && /[A-Z0-9]/.test(value)) { level++; }
				if (/[^A-Za-z0-9]/.test(value) && value.length >= 10) { level++; }
			}
			meter.setAttribute("data-level", String(Math.min(level, 4)));
		});
	});

	/* ---------- Dates ([data-timestamp], Unix seconds) ---------- */
	document.querySelectorAll("time[data-timestamp]").forEach(function (element) {
		var seconds = Number(element.getAttribute("data-timestamp"));
		if (seconds > 0) {
			var date = new Date(seconds * 1000);
			element.setAttribute("datetime", date.toISOString());
			element.textContent = date.toLocaleString(locale, { dateStyle: "medium", timeStyle: "short" });
		}
	});

	/* ---------- Copy button for code blocks ---------- */
	document.querySelectorAll(".codeblock").forEach(function (block) {
		var title = block.querySelector(".title");
		var body = block.querySelector(".body");
		if (!title || !body || !navigator.clipboard) {
			return;
		}
		var button = document.createElement("button");
		button.type = "button";
		button.className = "code-copy";
		button.innerHTML = '<svg><use href="' + iconSprite + '#i-copy"/></svg><span></span>';
		button.lastChild.textContent = TEXT.copy;
		button.addEventListener("click", function () {
			navigator.clipboard.writeText(body.innerText).then(function () {
				button.classList.add("is-done");
				button.lastChild.textContent = TEXT.copied;
				setTimeout(function () {
					button.classList.remove("is-done");
					button.lastChild.textContent = TEXT.copy;
				}, 1500);
			});
		});
		title.appendChild(button);
	});

	/* ---------- Copy a field's value (e.g. thread link): <button data-copy="#fieldId"> ---------- */
	document.querySelectorAll("[data-copy]").forEach(function (button) {
		var field = document.querySelector(button.getAttribute("data-copy"));
		var label = button.querySelector("span");
		if (!field) {
			return;
		}
		function done() {
			button.classList.add("is-done");
			if (label) {
				label.textContent = TEXT.copied;
			}
			setTimeout(function () {
				button.classList.remove("is-done");
				if (label) {
					label.textContent = TEXT.copy;
				}
			}, 1500);
		}
		// Fallback (no Clipboard API on plain http, or permission denied): select and copy
		function legacyCopy() {
			field.select();
			if (document.execCommand("copy")) {
				done();
			}
		}
		button.addEventListener("click", function () {
			if (navigator.clipboard) {
				navigator.clipboard.writeText(field.value).then(done, legacyCopy);
			} else {
				legacyCopy();
			}
		});
	});

	/* ---------- Moderator tools panel ---------- */
	var modToggle = document.querySelector(".mod-toggle");
	var modBody = document.getElementById("modBody");

	function setModTools(open) {
		modBody.hidden = !open;
		modToggle.setAttribute("aria-expanded", String(open));
	}

	if (modToggle && modBody) {
		modToggle.addEventListener("click", function () {
			setModTools(modBody.hidden);
		});
		// Open the panel as soon as something is selected for inline moderation
		document.addEventListener("change", function (event) {
			var target = event.target;
			if (target.type === "checkbox" && target.checked && (target.id.indexOf("inlinemod_") === 0 || target.name === "allbox")) {
				setModTools(true);
			}
		});
	}

	/* ---------- Post option tabs (newthread / newreply / editpost) ----------
	   The option rows (post options, moderator options, subscription, poll) become
	   tabs: the first one is open, clicking the open tab collapses it. The rows stay
	   in the form (only hidden), so every field is still submitted. */
	document.querySelectorAll(".post-opts").forEach(function (box, boxIndex) {
		var rows = Array.prototype.filter.call(box.children, function (element) {
			return element.classList.contains("form-row");
		});
		if (!rows.length) {
			return;
		}
		var bar = document.createElement("div");
		bar.className = "post-opts-tabs";
		bar.setAttribute("role", "tablist");

		var tabs = rows.map(function (row, index) {
			var label = row.querySelector(".form-label");
			var text = label && label.firstChild ? label.firstChild.textContent : "";
			var tab = document.createElement("button");
			tab.type = "button";
			tab.className = "post-opts-tab";
			tab.id = "post-opts-tab-" + boxIndex + "-" + index;
			tab.setAttribute("role", "tab");
			tab.textContent = text.trim().replace(/:\s*$/, "") || String(index + 1);
			tab.insertAdjacentHTML("beforeend", '<svg aria-hidden="true"><use href="' + iconSprite + '#i-chevron"/></svg>');
			row.id = row.id || "post-opts-panel-" + boxIndex + "-" + index;
			row.setAttribute("role", "tabpanel");
			row.setAttribute("aria-labelledby", tab.id);
			tab.setAttribute("aria-controls", row.id);
			tab.addEventListener("click", function () {
				select(tab.getAttribute("aria-selected") === "true" ? -1 : index);
			});
			bar.appendChild(tab);
			return tab;
		});

		function select(openIndex) {
			rows.forEach(function (row, index) {
				row.hidden = index !== openIndex;
				tabs[index].setAttribute("aria-selected", String(index === openIndex));
			});
		}

		box.insertBefore(bar, box.firstChild);
		box.classList.add("is-tabbed");
		select(0);
	});

	/* ---------- Forum status icon after "mark read" ----------
	   MyBB.markForumRead() only swaps forum_on -> forum_off on the element;
	   keep the icon in step with the class. */
	document.querySelectorAll(".forum-status.ajax_mark_read").forEach(function (element) {
		new MutationObserver(function () {
			if (element.classList.contains("forum_off")) {
				swapIcon(element, "forum_off");
			}
		}).observe(element, { attributes: true, attributeFilter: ["class"] });
	});

	/* ---------- Latest threads (index sidebar) ----------
	   Filled from MyBB's own RSS feed (syndication.php), which already respects
	   the visitor's forum permissions: no plugin needed. Title / date / starter, one per line. */
	var latestBox = document.getElementById("latestThreads");
	function latestDone(hasItems) {
		latestBox.classList.remove("is-loading");
		latestBox.removeAttribute("aria-busy");
		latestBox.hidden = !hasItems;
	}
	if (latestBox && !(window.fetch && window.DOMParser)) {
		latestDone(false);
	} else if (latestBox) {
		fetch(latestBox.getAttribute("data-feed"), { credentials: "same-origin" })
			.then(function (response) { return response.ok ? response.text() : ""; })
			.then(function (text) {
				var feed = new DOMParser().parseFromString(text, "application/xml");
				var items = feed.getElementsByTagName("item");
				var list = latestBox.querySelector(".latest-list");
				list.querySelectorAll(".lt-skeleton").forEach(function (skeleton) { skeleton.remove(); });
				var dateFormat = new Intl.DateTimeFormat(document.documentElement.lang || undefined, { day: "numeric", month: "long", hour: "2-digit", minute: "2-digit" });
				Array.prototype.forEach.call(items, function (item) {
					var field = function (name) {
						var node = item.getElementsByTagName(name)[0];
						return node ? node.textContent.trim() : "";
					};
					var link = field("link");
					if (!/^https?:\/\//.test(link)) {
						return;
					}
					var row = document.createElement("li");
					var title = document.createElement("a");
					title.className = "lt-title";
					title.href = link;
					title.textContent = title.title = field("title");
					var meta = document.createElement("span");
					meta.className = "lt-meta";
					var date = new Date(field("pubDate"));
					if (!isNaN(date)) {
						var time = document.createElement("time");
						time.dateTime = date.toISOString();
						time.textContent = dateFormat.format(date);
						meta.appendChild(time);
					}
					// dc:creator holds the profile link as HTML: read it as data, never insert it
					var creator = new DOMParser().parseFromString(field("dc:creator"), "text/html").querySelector("a");
					var name = creator ? creator.textContent : field("dc:creator");
					var by = document.createElement("span");
					by.className = "lt-by";
					if (name) {
						by.appendChild(document.createTextNode((latestBox.getAttribute("data-by") || "") + " "));
						var who = document.createElement(creator && /^https?:\/\//.test(creator.getAttribute("href")) ? "a" : "span");
						if (who.tagName === "A") {
							who.href = creator.getAttribute("href");
						}
						who.textContent = name;
						by.appendChild(who);
					}
					row.appendChild(title);
					row.appendChild(meta);
					if (by.firstChild) {
						row.appendChild(by);
					}
					list.appendChild(row);
				});
				latestDone(list.children.length > 0);
			})
			.catch(function () { latestDone(false); });
	}
})();
