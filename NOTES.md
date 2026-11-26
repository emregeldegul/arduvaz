# Arduvaz — Notlar

Statik bırakılan, mock olan ya da MyBB'nin sınırları yüzünden farklı çözülen yerler.
Şablonlarda `<!-- TODO:lang -->` ve `<!-- MOCK -->` yorumlarıyla da işaretlidir.

## Mock (siteye özel, statik içerik)

| Şablon | İçerik |
|---|---|
| `index` | Hero açıklaması |
| `index` | "Güncel Sürüm" kutusu (sürüm, paketler, bağlantılar) |
| `footer` | Tanıtım metni, sosyal bağlantılar (GitHub, Blog) |
| `footer` | "Kaynaklar" sütunu |
| `footer` | Yasal bağlantılar (Gizlilik, Kullanım Koşulları) |

## Dil değişkeni olmayan metinler (TODO:lang)

| Şablon | Metin |
|---|---|
| `header` | "Menü" (mobil menü düğmesi, aria-label) |
| `header_quicksearch` | "Kapat" (aria-label) |
| `header_welcomeblock_guest` | Modal karşılama cümlesi, "Hesabın yok mu?" |
| `footer` | Sütun başlıkları: Topluluk, Kaynaklar, Forum Araçları |
| `showthread` | "Konu bağlantısı" (etiket), "Kopyala" (buton; JS sonra arduvaz.js TEXT.copy/copied kullanır) |
| `usercp_editsig` | "Mevcut mesajlardaki imza" (güncelleme seçenekleri etiketi) |
| `member_login`, `member_lostpw`, `member_activate`, `member_resendactivation`, `member_resetpassword` | Kartın sol bölmesindeki kısa açıklama cümlesi |
| `index` | Misafir kartı alt yazısı, "Hesabın yok mu?" |
| `index_logoutlink` | Referans, Rep, Son ziyaret |
| `forumbit_depth2_forum` | "Forum seçenekleri" (aria-label), "Yeni Konu Aç", "Okundu say" |
| `search_results_*_inlinemoderation` | Moderatör bağlantıları: Onay bekleyenler, Raporlanan mesajlar, Moderatör günlüğü |
| `search` | "Konu öneki" (alan etiketi) |
| `showthread` | Konu bilgi etiketleri: Açan, Açılış, Son yanıt, Yanıt, Görüntülenme |
| `arduvaz.js` (`TEXT`) | Kod bloğu düğmesi: "Kopyala", "Kopyalandı" |
| `member_profile` | Sekmeler: "Profil", "Forum Bilgileri", "Yönetim"; "Topluluk" paneli; "Diğer seçenekler" (aria-label) |
| `member_profile_modoptions` | "Kullanıcı notları" |
| `member_profile_customfields` | "Hakkında" (panel başlığı) |
| `memberlist` | "Tümü" (harf filtresi) |
| `member_register`, `member_register_password` | "Zaten hesabın var mı?", "Şifreyi göster" (aria-label) |

## MyBB sınırları ve çözümler

- **Üye/misafir kartı (ana sayfa):** Üye kartı `index_logoutlink` şablonunda (MyBB bunu sadece üyelere üretir). Misafir kartı `index` şablonunda durur, `data-uid` 0 değilse CSS ile gizlenir.
- **Kullanıcı unvanı:** `{$mybb->user['usertitle']}` gösterilir. Boşsa CSS ile grup adına düşer. Kullanıcının yazdığı unvan kaçış yapılmadan basılır; bunu sadece kullanıcının kendisi görür.
- **Kategori daraltma:** MyBB JS'i `<img>` bekler. Görünmez bir `<img class="expander">` tıklamayı alır, ikonu CSS çizer.
- **Forum durum ikonu:** "Okundu say" sonrası ikon değişimini `arduvaz.js` yapar.
- **Yönlendirme forumları:** MyBB, yönlendirme adresini şablona vermez. Son mesaj alanında "–" görünür, seçenek menüsü gizlidir.
- **"Son Mesaja Git":** Mesajı olmayan forumlarda güvenilir bir bağlantı olmadığı için forum menüsüne konmadı.
- **Bugün uğrayan üyeler:** Varsayılan MyBB'de ana sayfada bu veri yok, eklenmedi.
- **Bildirimler:** `header` şablonunun sonunda yer aldıkları için hero'nun üstünde görünürler.
- **İstatistik sayıları:** Şablona ham sayı gelir, binlik ayırıcıyı `arduvaz.js` sayfa diline göre ekler.
- **`logo` tema ayarı:** Logo SVG olduğu için kullanılmıyor.
- **Konu listesi puanı:** Yıldızlar sadece gösterim amaçlı. MyBB'nin listeden puan verme özelliği (rating.js) kullanılmıyor; puan konu sayfasından verilir.
- **Konu durum ikonu:** `icons.svg` içinde MyBB'nin bütün klasör adları için (`thread_newhotfolder` vb.) ikon var; şablonda `#thread_{$folder}` kullanılır.
- **Onay bekleyen / silinmiş konu:** Tasarımdaki "Onay bekliyor / Silindi" rozetleri yok (koşul yazılamıyor); durum, satırın rengiyle (`trow_shaded`, `trow_deleted`) gösterilir.
- **Konu önekleri:** Tasarımdaki görünüm için ACP > Konu Önekleri > "Görünüm stili": `<span class="prefix">Sorun</span>` (çözüldü için `prefix is-solved`).
- **Moderatör araçlarındaki sayaçlar:** Tasarımdaki sayılar (onay bekleyen, rapor) MyBB tarafından bu sayfaya verilmiyor; sadece bağlantılar var.

- **Konu bilgi alanı tarihleri:** MyBB şablona ham zaman damgası verir; `arduvaz.js` tarayıcının saat dilimine göre biçimlendirir (MyBB'nin kullanıcı saat dilimi ayarı kullanılmaz).
- **Konu bilgi alanı:** Tasarımdaki "Favori", "Son okumanız" ve "Konu sahibi" rozeti MyBB'de yok, eklenmedi.
- **Postbit:** `postbit` ve `postbit_classic` aynı tasarım; kullanıcının düzen tercihi görünümü değiştirmez. Mesaj kutusu `div.post` olmalı (`thread.js` bunu arar).
- **Varsayılan avatar:** `default_avatar` görseli CSS ile gizlenir, yerine SVG siluet görünür.
- **Anket:** Oy verme ve sonuç kutusu ile `polls.php?action=showresults` sayfası `poll.css` kullanır. MyBB'nin `{$totpercent}` değeri her zaman %100/%0 olduğu için gösterilmez. Kullanıcının oyu `*` yerine onay rozetiyle işaretlenir.
- **Mesaj ekleri:** Küçük resimler yan yana, dosyalar kart olarak listelenir (`postbit.css`, `att-` önekli sınıflar). MyBB'nin her N küçük resimde eklediği `<br>` gizlenir. Dosya türü ikonu MyBB'nin ek türü görselidir.
- **Ağaç görünümü, benzer konular, konu notları:** `showthread.css` içinde. Konu notları kutusu MyBB daraltmasını kullanır (`threadnotes_e`).
- **Anket formları:** Oluşturma ve düzenleme sayfaları yazma sayfalarının form düzenini kullanır (`posting.css` artık `polls.php`'ye de bağlı). Varsayılan temadaki satır içi jQuery betiği kaldırıldı; "azami seçim" alanı çoklu seçim işaretli değilse CSS `:has()` ile gizlenir. Anket silme formu (`moderation.php`) düzenleme sayfasının altında ayrı panelde.

- **Profil sekmeleri:** `arduvaz.js` içeriği olmayan sekmeyi gizler (Yönetim sekmesi sadece moderatör/yöneticiye görünür). JS kapalıyken tüm paneller alt alta görünür.
- **Profil düğmeleri:** Arkadaş ekle / yok say / bildir düğmeleri tek şablondan (`member_profile_addremove`) gelir; hepsi "diğer seçenekler" menüsünde. İkonları `icons.svg` içindeki sınıf adlı semboller (`add_buddy_button` vb.) belirler.
- **Hakkında (özel profil alanları):** Alanlar ACP'de "profilde göster" açık kalmalı. MyBB sadece bu alanları kaçış yapıp biçimlendirir; gizlenen bir alanı şablonda `{$userfields['fidX']}` ile basmak XSS açığı olur. Yerleşimi CSS yapar: `fid 2` (Bio) solda paragraf, diğer alanlar (`fid 1` Location vb.) sağda liste (`.pf-field-{fid}`).
- **Profil başlığı:** Tasarımdaki "söz" (alıntı) alanı MyBB'de yok, eklenmedi.
- **Üye listesi:** MyBB üye listesine çevrimiçi durumu ve toplam üye sayısını vermez; kartlarda çevrimiçi noktası ve başlıkta sayaç yok. Sıralama yönü tasarımdaki seçim kutusu yerine MyBB'nin radyo düğmeleri. Kullanıcı adı alanı MyBB'nin select2 otomatik tamamlamasını kullanır.

- **Kayıt:** Tasarımdaki "kuralları kabul ediyorum" kutusu yok; MyBB'de sözleşme ayrı bir adım (`member_register_agreement`). Kullanıcı adı uygunluk mesajı MyBB'nin doğrulama betiğinden (`regvalidator.js`) gelir. Şifre gücü göstergesi ve göster/gizle düğmesi `arduvaz.js`'te. Captcha yenile düğmesi her zaman görünür (varsayılan tema AJAX kapalıysa gizliyordu). reCAPTCHA / hCaptcha / Turnstile kutuları kayıt sayfasında ayrı panelde (`member_register_regimage_*`). COPPA: doğum tarihi adımı ve sözleşmedeki COPPA bölümü kayıt düzenini kullanır; yazdırılacak ebeveyn formu (`member_coppa_form`) tema stillerini yüklemeyen bağımsız sayfadır, kendi `<style>` bloğu ve SVG logo ile gelir.

- **Form satırları:** MyBB'nin `<tr>` olarak gelen satır şablonları (giriş kutusu, mesaj ikonu, seçenekler, abonelik, anket, captcha, düzenleme sebebi) `div.form-row` yapısına çevrildi. `post_captcha` hızlı yanıtta ve giriş sayfalarında da bu yapıyla çalışır. reCAPTCHA / hCaptcha / Turnstile şablonları (`post_captcha_*`) da aynı yapıda (`.captcha-widget`). Görünmez türlerin (`*_invisible`) betikleri değişmedi, sadece baştaki `<br />` kaldırıldı.
- **Ekler (yazma sayfası):** `post.js` dosya alanının 2. üst öğesini gizler, 3. üst öğesine yeni ekleri ekler; sürükle-bırak alanının 2. üst öğesini gösterir. `post_attachments*` şablonlarındaki iç içe geçme derinliği bu yüzden değiştirilmemeli.
- **Editör (SCEditor):** Kendi tema dosyasını (`editortheme`: mybb.css) kullanır; temada sadece çerçeve ve araç çubuğu rengi uyarlandı.

- **Kullanıcı paneli yerleşimi:** MyBB'nin panel ve özel mesaj sayfaları `<table><tr>{$usercpnav}<td>…</td></tr></table>` yapısını kullanır. `usercp_nav` hücresi `td.ucp-nav` sınıfını taşır; `usercp.css` bu hücreyi içeren tabloyu `:has()` ile iki sütunlu ızgaraya çevirir. Böylece her sayfa şablonu ayrı ayrı değiştirilmeden yan menülü düzen elde edilir.
- **Panel menüsü:** Gruplar MyBB'nin daraltma mekanizmasıyla açılıp kapanır (`tcat_collapse_collapsed`). Bulunulan sayfanın bağlantısını `arduvaz.js` vurgular.

- **Panel liste sayfaları:** Abonelikler, taslaklar, ekler, gruplar ve arkadaşlık istekleri tablo olarak kaldı (gerçek tablo verisi); durum ikonları temanın SVG ikonlarıyla değiştirildi. Arkadaş / yok sayılanlar listesi kart görünümünde; `usercp.js`'in kullandığı id'ler (`buddy_list`, `ignore_list`, `sentrequests`, `{tür}_{uid}` …) korunmalı.

- **Özel mesajlar:** Gelen kutusu, okuma, hızlı yanıt ve yazma ekranları uyarlandı. Mesaj durumu (`new_pm`, `old_pm`, `re_pm`, `fw_pm`) MyBB'de görsel dosyasıydı; `icons.svg` içindeki `pm_*` ikonlarıyla gösteriliyor. Takip, klasör yönetimi, klasör boşaltma, dışa aktarma, gelişmiş arama ve arama sonuçları da uyarlandı (`usercp.css`). Silinemeyen klasörler kilit simgesiyle gösterilir; özgün adı simgenin ipucundadır. Dışa aktarılan dosyaların şablonları (`private_archive_html/txt/csv*`) sayfa değil indirme dosyası olduğu için varsayılan haliyle bırakıldı. Çoklu alıcı açılır menüsü (`private_multiple_recipients*`) MyBB'nin `popupMenu` yapısıyla varsayılan haliyle duruyor.

- **Arama:** Sonuçlar konu listesinin satır düzenini kullanır (`forumbit.css` ve `forumdisplay.css` arama sayfasına da bağlı); puan sütununun yerinde forum sütunu var. Mesaj sonuçlarında son mesaj sütunu mesajın tarihini ve yazarını gösterir. Önek seçimi, önek tanımlı değilse gizlenir.

- **Ekip sayfası:** MyBB bu sayfaya avatar vermez; kartlarda SVG siluet ve çevrimiçi / uzakta / çevrimdışı noktası var. E-posta ve ÖM düğmeleri `postbit_email` / `postbit_pm` şablonlarından gelir.
- **Kimler çevrimiçi:** Liste ve "bugün gelenler" aynı satır düzenini kullanır (`online.css`). Sıralama bağlantıları MyBB'deki gibi sadece tek yönlü.

- **Yardım:** Bölümler iki sütunlu ızgarada (`help.css`); arama formu başlığın yanında. Bölüm başlığı MyBB daraltması için `thead` sınıfını taşır, rengi `help.css` ezer. Arama kutusu eski `onfocus/onblur` hilesi yerine `placeholder` kullanır. Belge sayfasının `<title>` etiketinde belge adı görünür.

- **Moderatör paneli (Mod CP):** Yan menü ve iki sütunlu yerleşim kullanıcı panelininkiyle aynı (`td.ucp-nav`, `.ucp-links`, `.ucp-group`); bu yüzden `usercp.css` `modcp.php`'ye de bağlı, Mod CP'ye özel stiller `modcp.css`'te. Menü grupları MyBB daraltmasını kullanır (`modcpforums`, `modcpusers`). Ana sayfada onay bekleyenler kart olarak, son işlemler / bitmek üzere olan yasaklar tablo olarak, moderatör notları not defteri panelinde. Yasak kalan süresi MyBB'nin sınıflarıyla (`imminent_banned`, `high_banned` …) renklenir.

- **Onay kuyruğu:** Konu ve mesajlar tablo satırı yerine kart (`.mcp-q-item`) olarak listelenir; Konular / Mesajlar / Ekler geçişi başlıkta sekme. Yoksay / Sil / Onayla radyo düğmeleri bölümlü seçim kutusuna dönüştü; MyBB'nin sınıf ve adları (`radio_ignore`, `threads[tid]` …) korunduğu için "hepsini işaretle" bağlantıları çalışır. Silinecek / onaylanacak kartın kenarında renkli şerit (`:has()`). Kuyruk sekme şablonlarındaki `{$navsep}` (" | ") kaldırıldı.
- **Rapor merkezi:** `inline_reports.js`'in kullandığı yapı korunur: satır `tr.inline_row`, onay kutusu `reports_{rid}`, `allbox`, `#inline_read`, `#selectAllrow` / `#allSelectedrow`.
- **Menü vurgusu:** `arduvaz.js` sırayla: bağlantının `data-also` listesinde geçerli `action` (ör. Duyurular → `delete_announcement`, Profil Düzenleyici → `editprofile`; POST sonrası adreste `action` olmadığından formlardaki gizli `action` alanlarına bakılır), tam adres, aynı sayfa + `action` (ör. `modqueue&type=posts`).

- **Moderatör / uyarı kayıtları:** Filtre formu varsayılan temadaki gibi tablonun altında değil, üstünde iki sütunlu panelde (`.mcp-filter-grid`, etiketler alanın üstünde). Uyarı kaydındaki select2 kullanıcı arama betiği değişmedi (`#username`). Sayfalama tablo satırı yerine tablonun altında (`modcp_modlogs_multipage`). Uyarı puanı rozet, geri alınan uyarı kırmızı "Geri alındı" etiketiyle gösterilir.

- **Duyurular (Mod CP):** Liste tablo olarak; forum satırları gri başlık, alt forum girintisi MyBB'nin `{$padding}` değerinin yarısı (`--pad`). Etkin / süresi dolmuş duyuru yeşil / gri noktayla gösterilir (varsayılan temadaki `subforumicon` görselleri yerine). Ekleme / düzenleme formu yazma sayfalarının form düzenini kullanır; bu yüzden `posting.css` ve önizleme için `postbit.css` duyuru eylemlerine (`modcp.php?new_announcement,edit_announcement,do_…`) bağlı. Silme onay sayfasında "Vazgeç" düğmesi yok (dil paketinde karşılığı yok); kırmızı düğme `.btn-danger` (`modcp.css`).

- **Kullanıcı bul / Profil düzenleyici:** Kullanıcı arama filtresi kayıt sayfalarındaki panel düzeninde, select2 betiği değişmedi. Profil düzenleyici kullanıcı panelinin iki sütunlu form düzenini kullanır (`ucp-grid-2`); zorunlu / ek profil alanları UCP ile ortak şablonlardan (`usercp_profile_customfield`, `usercp_profile_profilefields`) gelir, uzakta bölümü `usercp_profile_away` ile aynı. Moderasyon ve imza askıya alma kutularının id'leri (`modpost`, `suspost`, `modposts_action`, `susposts_action`, `suspend_action`) varsayılan temadaki satır içi betik için korunur. Özel ünvan yoksa MyBB "mevcut ünvan" etiketini boşaltır; satır `:has(> .form-label:empty)` ile gizlenir. Dil paketinde "Avatar" etiketi olmadığından "avatarı kaldır" etiketsiz tek onay kutusu.

- **Yasaklama:** Liste ana sayfadaki "yakında bitecek yasaklar" tablosuyla aynı satır şablonunu (`modcp_banning_ban`) kullanır. Yasak ekleme / düzenleme formu panel içinde form satırları; "Yasağı kaldır" bağlantısı panel başlığında. Kullanıcı adı alanının select2 betiği değişmedi. Yasaklanacak grup tek seçenekse MyBB gizli alan gönderir, satır görünmez.
- **Panel olan formlar:** Kullanıcı / Mod paneli içerik hücresindeki formlar alt alta 16px aralıkla dizilir; form aynı zamanda `.panel` ise (filtreler, not defteri, yasak formu) aralık sıfırlanır (`usercp.css`).

- **IP arama:** Arama formu üstte panel, sonuçlar altta tablo. Sonuç türü (kayıt IP'si / son IP / mesaj) küçük etiketle gösterilir. "IP bilgisi" penceresi (`modcp_ipsearch_misc_info`) MyBB'nin modalında açılır, giriş modalının stillerini (`.modal-head`, `.info-list`) kullanır; `iplookup` adresi doğrudan açılırsa varsayılan temadaki gibi stilsiz görünür.

- **Modallar (jQuery modal):** `.blocker` flex ile ortalar (eski `::before` + inline-block yöntemi modalı sağ alta itiyordu), z-index 9999 (`modal_zindex`). MyBB'nin bazı popup şablonları (`misc_smilies_popup`) iç içe `.modal` içerir; içteki düz kap olarak gösterilir. Koyu `thead` ile başlayan popup'larda kapatma düğmesi açık renk.
- **Açılır listeler:** Chrome 135+ `appearance: base-select` ile tema renginde seçim paneli (`::picker(select)`); diğer tarayıcılar yerel listeyi gösterir. Çoklu seçim/listbox (`multiple`, `size`) hariç. Seçenekler `select … option` ile hedeflenir (`::picker(select) option` geçersiz seçici, tüm kural düşer). Üzerindeki seçenek koyu zemin, seçili olan kalın + tik.

- **Kayıt formu:** Tek kart (`.rg-card`). Alt şablonların `.panel.rg-section` kutuları kart içinde CSS ile düz bölüme dönüşür (şablonlara dokunmadan). Görsel doğrulama + güvenlik sorusu altta tam genişlik `.rg-verify` bandında yan yana; gönder butonu kart alt çubuğunda sağda.
- **Captcha satırı:** `post_captcha` ve `member_register_regimage` aynı düzende: görsel | cevap kutusu | yenile ikon butonu (id'ler korunur: `captcha_img`, `imagestring`, `imagehash`).
- **Mesaj/giriş sayfaları:** `.msg-page` 760px; giriş kartları (`.auth-card`: login, lostpw, aktivasyon, parola sıfırlama) 880px, geniş ekranda iki bölme. Yönlendirme kartı üstten ~%16 hizada.

- **Sayfalama:** `.pagination_previous` oku global.css'te ters çevrilir (tüm sayfalarda). Breadcrumb sayfa menüsü (`#breadcrumb_multipage_popup`, varsayılan şablon) CSS ile kart + işaret oku.
- **Son mesaj yok / gizli:** `forumbit_depth2_forum_lastpost_never/_hidden` normal son mesaj düzeninde: başlık "Never" / "Gizli" (TODO:lang), yazar "–", tarih yer tutucu `00-00-0000, 00:00`.
- **Konu altı (showthread):** Konuda ara kartın üstünde, altında konu bağlantısı + kopyala (`[data-copy]`, arduvaz.js; Clipboard API yoksa select + execCommand); `showthread_usersbrowsing` başlık + isim listesi olarak kalan yüksekliği doldurur.
- **Kategori/forum açıklaması:** Ana sayfa kategori başlığında ve forum görünümü konu listesi başlığında açıklama metni yerine, başlığın üstüne gelince sağında açılan baloncuk (`.tip-anchor` + `.cat-tip`, global.css). Dokunmatik ve ≤760px ekranda gizli; açıklama boşsa hiç görünmez.
- **Araç çubuğu (`.fd-toolbar`):** Sayfalama yoksa da yeni konu / yanıt butonu sağda kalır.

- **Mesaj aralıkları:** `#posts` içinde her mesajdan önce boş `<a id="pidX">` çapası var; flex `gap` bu çapaları da öğe saydığı için aralık iki katına çıkıyordu. Aralık `.posts > div ~ div` margin ile verilir.
- **Hızlı yanıt:** Mesaj kutusu düzeninde (200px yazar sütunu, 150px avatar + kullanıcı adı). Avatar varsayılan SVG (header'daki gibi; ham avatar adresi basılmıyor).
- **jGrowl:** Eklenti kapsayıcıya boş bir `.jGrowl-notification` yer tutucu ekler; `:empty` gizlenir (yoksa bildirimin üstünde boş kutu kalıyordu).

- **Mesaj yazma sayfaları (newthread / newreply / editpost / anket):** `{$loginbox}` panel başlığının sağında (`changeuserbox` → "Kullanıcı adı: X · change user", misafirde `loginbox` küçük kutu). Seçenek satırları `.post-opts` içinde; `arduvaz.js` sekmelere çevirir (ilk sekme açık, açık sekmeye tıklayınca kapanır; alanlar formda kalır). JS yoksa satırlar olduğu gibi görünür.
- **Mesaj ikonları:** Sadece ikon kutucukları (38px ızgara), "ikon yok" başta 2 hücre; en fazla 2 satır, fazlası kendi içinde kayar (posting.css).

- **Profil:** "Hakkında" (özel alanlar) ve ek bilgiler kartı `.pf-info-row` içinde yan yana; özel alan yoksa ek bilgiler tam genişlik.
- **Üye listesi:** "Gelişmiş arama" bağlantısı panel başlığının sağında (`.panel-head-links`).
- **İtibar raporu:** `reputation*` şablonları temalandı, `reputation.css` (sadece reputation.php). Silme/şikâyet bağlantıları MyBB sınıflarını (`postbit_qdelete`, `postbit_report`) ve `#ridX` id'sini korur.
- **Ban sebebi (bilgi):** MyBB sebebi yalnızca yasaklama yetkisi olana ve `banned` tablosunda kaydı olan kullanıcıda gösterir; elle yasaklı gruba taşınan kullanıcıda kutu çıkmaz (çekirdek davranışı).

- **İmza düzenleme:** Açıklama (`edit_sig_note`) panel üstünde bilgi satırı; editör tam genişlik; izinler (`edit_sig_note2`, `<br />` ayrımlı) editör altında 3 sütunlu kutu; "Mevcut mesajlardaki imza" seçenekleri ayrı satırda (TODO:lang etiket).
- **Tablo vurgu satırları:** `td.trow_shaded` / `td.trow_deleted` `.trow1` ile aynı iç boşluğu alır (abonelikler vb. satır kaymasın).
- **UCP boş durum rehberi:** `usercp_drafts_none` ikonlu, sola hizalı; boşken "tümünü seç" ve pasif silme butonu gizli.
- **Forum abonelikleri:** son mesaj `forumbit_depth2_forum_lastpost` şablonunu kullanır; stili usercp.css'te (forumbit.css UCP'de yüklenmez).

- **Özel mesaj listesi:** Gönderen ve tarih sütunları (`.pm-from`, `.pm-date`) içerik kadar dar; başlık sütunu kalan alanı alır.
- **Özel mesaj yazma:** "Arkadaşlardan seç" ve "BCC" butonları alıcı kutusunun altında (`.pm-to-tools`; JS ile yazılır). Arkadaş seçme penceresi (`xmlhttp_buddyselect*`) temalandı; çevrimiçi/çevrimdışı durum noktası CSS (temada `buddy_online.png` yok). `label > input + ad` yapısı korunur: `usercp.js` seçili adları label metninden okur.
- **Mesaj ikonları stili global.css'te** (özel mesaj sayfası posting.css yüklemez).
- **Özel mesaj okuma:** "Kime:" başlık satırında tarih hizasında; `.post-meta` (IP) gövdeyle aynı 20px hizada (konu görünümünde de).

- **Uyarı ayrıntısı (warnings.php?action=view):** `warnings_view*` şablonları temalandı, `warnings.css` (sadece warnings.php). Bilgiler iki sütunlu `info-list`; iptal formunda neden kutusu tam genişlik, buton kart alt çubuğunda.
- **Mod CP kuyruğu:** Toplu işaretleme bağlantıları (`modqueue_mass`) satır seçicisi görünümünde; "Perform Actions" ile tek eylem kartında.

- **Yardım araması:** Tek kutu: anahtar kelime | "Ada göre / Belgeye göre" aç-kapa etiketleri (checkbox'lar formda, `.help-chip`) | buton.
- **Varsayılan MyBB portalı:** Yalnızca `portal_announcement*` şablonları temalandı (`portal.css` + ekler için `postbit.css`); yan bloklar MyBB varsayılanında. Yazdırma/gönderme bağlantıları ikonlu (temada `printable.png`/`send.png` yok). MyBB ikon yoksa `{$icon}` = `&nbsp;` basar; başlıkta `font-size: 0` ile etkisiz.

## Yayınlarken

- `headerinclude` içindeki `arduvaz.js?ver=1000` sürüm numarası her JS değişikliğinde artırılmalı (tarayıcı önbelleği).

## Kurulum paketi

- Tema XML: `dist/arduvaz-theme.xml`
- Görseller: `images/` → `images/arduvaz/`
- JS: `jscripts/arduvaz.js` → `jscripts/arduvaz.js`
- Grup stilleri: ACP > Kullanıcı Grupları > "Kullanıcı adı stili" (`<span class="u-admin">{username}</span>`; sınıflar `global.css` sonunda)

## 3. test turu (2026-11-26)
- **Son Konular (ana sayfa yan sütun):** `index` şablonundaki `#latestThreads` kutusu, MyBB'nin kendi RSS beslemesinden (`syndication.php?limit=6`, ziyaretçinin izinlerine uyar) `arduvaz.js` ile doldurulur; eklenti/şablon seti gerekmez. Sıra = konu açılış tarihi (RSS böyle verir). Tarih tarayıcının saat diliminde biçimlenir. Her konu 3 satır (başlık / tarih / `{$lang->by}` yazar). Veri gelene kadar şablondaki iskelet satırlar görünür (`.is-loading`); besleme boşsa ya da hata olursa kutu gizlenir. Altta "View New Posts" bağlantısı.
- **Forum üç nokta menüsü:** Yeni Konu Aç, forum bazlı yeni/bugünkü mesajlar (`search.php?action=getnew|getdaily&fid=`), Son mesaj (boşsa gizli), Okundu say (yalnız `forum_on` iken, AJAX), RSS, sayılar. Yönlendirme forumunda düğme gizli.
- **Güncel Sürüm kutusu kaldırıldı**, HTML + CSS yedeği `theme/backup/guncel-surum/` (geri gelecek).
- **Son mesaj (forum listesi):** başlık / tarih / `{$lang->by}` yazar — üç satır, avatar 58px. Never/Gizli eski iki satırlı düzende kaldı (kullanıcı kararı).
- **Forumdisplay puanlama:** varsayılan `ul.star_rating` + `Rating.build_forumdisplay` yapısına dönüldü (rating.js `forumdisplay_threadlist_rating` içinde yüklenir); görünüm star_ratings.css.
- **Konu başlığı öncesi** (`.t-lead`): MyBB'nin koyduğu `&nbsp;`'ler font-size:0 ile etkisiz; boş prefix/simge kayması yok. Yerinde başlık düzenleme kutusu satırı kaplar (en çok 640px).
- **IP:** logip=hide iken adminler de IP'yi "Logged" düğmesine tıklayınca görür (MyBB davranışı); `postbit_iplogged_hiden/show` temalandı. İmza düz çizgi + kısa vurgu, IP satırı kesikli çizgiyle ayrılır.
- Header: marka adı `bbname`; açılır menüde Profil yok, Arkadaş listesi kendi bölümünde, çıkış simgesi i-power; misafire "yeni mesajlar" simgesi eklendi; arama placeholder `{$lang->search_button}…`. İstatistikte "Üye" → `{$lang->online_member_plural}` (ilk harf CSS ile büyük).
- **Breadcrumb:** `nav_bit` = `<span class="crumb">` (ayırıcı öğenin önünde), `nav_sep` boş. İlk öğe (forum adı) CSS ile gizli, ev simgesi onun yerine; bulunduğun sayfa (`nav_bit_active`) `nav` şablonunda basılmaz.
- **Duyuru sayfası:** `announcement_edit/quickdelete` konu sayfasındaki düzenle/sil düğmeleriyle aynı (`pf-btn pf-muted` + simge).
- **Forumdisplay mobil:** başlık satırı düz metin akışı (simge/Poll:/prefix/başlık/ek aynı cümlede), son mesaj tek satır (ok · tarih · yazar, avatar yok, kesikli üst çizgi), başlık bağlantıları sarılır.
- **Tarih + flex gap:** göreli tarih iki parça gelir (`<span>Yesterday</span>, 09:35`); flex içinde `<span>` ile sarılır, yoksa "Yesterday , 09:35" olur (postbit, duyuru satırı).
- **Showthread mobil:** başlık düz metin akışı (prefix başta, ayrı satır yok); puan + araçlar başlık altında çizgiyle ayrılmış bant (puan solda, araçlar sağda); bilgiler 6 sütunlu ızgara (üstte açan/yanıt/görüntülenme, altta iki tarih; etiket üstte). Anket başlığında bağlantılar mobilde soru altına iner (poll.css). Postbit mobil: ad / ünvan / yıldız alt alta.
- **Liste tabloları mobil (UCP + Mod CP, usercp.css sonu):** ≤760px'te `.ucp-table` kendi kutusunda yatay kayar (sayfa kaymaz); hücreler en az 96px, kelimeler bölünmez; thead içeriği sticky. Başlık bağlantıları (`ucp-head-link`) artık `<strong>`'dan SONRA (masaüstünde float:right aynı satır, mobilde başlığın altında). Mobil ölçüm: headless dump modunda pencere 485px'in altına inmiyor → sayfayı 390px iframe içinde ölç.

## Demo site / English (2026-11-26)
- All visible `TODO:lang` strings in templates and `arduvaz.js` are now English (the tables above list their old Turkish wording). Template comments are still Turkish.
- Footer and index hero mock text describe the "Marginalia" book club demo site (see `demo/README.md`).
- Footer: "Arduvaz theme by MyBB.tr" (https://mybb.tr) credit next to MyBB's "Powered by" (`.powered.theme-credit`).
- Mobile hero buttons wrap (`index.css`), no overflow at 390px.
- Release package + framed screenshots: `~/Desktop/Arduvaz-MyBB-Theme/` (montage generator was a scratch script: HTML/CSS frames rendered by headless Chrome @2x).

## Admin CP teması (admin/arduvaz)

Kaynak `theme/admin/arduvaz/` → `deploy.sh` ile `src/admin/styles/arduvaz/`'a kopyalanır.
Yalnız CSS (varsayılan ACP HTML'i). `style.php` sadece viewport meta etiketini ekler
(header + giriş/2FA/kilit sayfaları); başka çıktı değişikliği yok.

| Adım | Kapsam | Durum |
|---|---|---|
| 1 | Temel: renkler, Inter, header (logo/menü/hesap), sol menü, breadcrumb, footer, mobil yerleşim | ✅ |
| 2 | Tablolar (`table.general`, `.border_wrapper`), formlar, evet/hayır seçimleri, butonlar, onay kutusu, sayfalama | ✅ |
| 3 | Sekmeler (`.nav_tabs`, `ul.tabs`), popup menüler, mesajlar (flash/alert/div.error), select2, jGrowl, modal.css | ✅ |
| 4 | Dashboard (home.css: istatistik tablosu mobilde etiket/değer ızgarası, kartlar alt alta) ve giriş/2FA/kilit ekranı (login.css) | ✅ |
| 5 | Modül CSS'leri (forum: mod kuyruğu; user: kart görünümü, grup ayarları; style: CodeMirror, fark), sürükle-bırak alan listeleri, arama kutuları | ✅ |

Notlar: breadcrumb ayırıcıları CSS'ten (`> * + *::before`), çekirdek son öğeden önce "»" basmıyor.
main.css sonundaki "varsayılan temadan kalan" bölüm yalnız yardımcılar (float/align) ve jGrowl iskeletidir. config.css (dil düzenleyici) varsayılan haliyle bırakıldı.
jQuery UI yalnızca sürükle-bırak listelerinde (view_fields / quick_perm_fields) kullanılıyor → 5. adım. Headless ekran görüntüsünde geçişli (transition) renkler ara değerde kalır; gerçek tarayıcıda sorun değil.
Giriş ekranı oturum yokken gösterildiği için genel `cpstyle` ayarındaki stili kullanır; yerel sitede bu ayar `arduvaz` yapıldı (2026-11-26).
