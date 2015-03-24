(function() {
	var phpKeywords = (
//Popular PHP Functions
"addcslashes addslashes bin2hex chop chr chunk_split convert_cyr_string convert_uudecode convert_uuencode count_chars crc32 crypt echo explode fprintf "+
"get_html_translation_table hebrev hebrevc hex2bin html_entity_decode htmlentities htmlspecialchars_decode htmlspecialchars implode join lcfirst "+
"levenshtein localeconv ltrim md5_file md5 metaphone money_format nl_langinfo nl2br number_format ord parse_str print printf quoted_printable_decode "+
"quoted_printable_encode quotemeta rtrim setlocale sha1_file sha1 similar_text soundex sprintf sscanf str_getcsv str_ireplace str_pad str_repeat "+
"str_replace str_rot13 str_shuffle str_split str_word_count strcasecmp strchr strcmp strcoll strcspn strip_tags stripcslashes stripos stripslashes "+
"stristr strlen strnatcasecmp strnatcmp strncasecmp strncmp strpbrk strpos strrchr strrev strripos strrpos strspn strstr strtok strtolower "+
"strtoupper strtr substr_compare substr_count substr_replace substr trim ucfirst ucwords vfprintf vprintf vsprintf wordwrap "+
"array_change_key_case array_chunk array_combine array_count_values array_diff_assoc array_diff_key array_diff_uassoc array_diff_ukey array_diff "+
"array_fill_keys array_fill array_filter array_flip array_intersect_assoc array_intersect_key array_intersect_uassoc array_intersect_ukey "+
"array_intersect array_key_exists array_keys array_map array_merge_recursive array_merge array_multisort array_pad array_pop array_product "+
"array_push array_rand array_reduce array_replace_recursive array_replace array_reverse array_search array_shift array_slice array_splice "+
"array_sum array_udiff_assoc array_udiff_uassoc array_udiff array_uintersect_assoc array_uintersect_uassoc array_uintersect array_unique "+
"array_unshift array_values array_walk_recursive array_walk array arsort asort compact count current each end extract in_array key krsort "+
"ksort list natcasesort natsort next pos prev range reset rsort shuffle sizeof sort uasort uksort usort "+
"basename chgrp chmod chown clearstatcache copy delete dirname disk_free_space disk_total_space diskfreespace fclose feof fflush fgetc fgetcsv "+
"fgets fgetss file_exists file_get_contents file_put_contents file fileatime filectime filegroup fileinode filemtime fileowner fileperms filesize "+
"filetype flock fnmatch fopen fpassthru fputcsv fputs fread fscanf fseek fstat ftell ftruncate fwrite glob is_dir is_executable is_file is_link "+
"is_readable is_uploaded_file is_writable is_writeable lchgrp lchown link linkinfo lstat mkdir move_uploaded_file parse_ini_file parse_ini_string "+
"pathinfo pclose popen readfile readlink realpath_cache_get realpath_cache_size realpath rename rewind rmdir set_file_buffer stat symlink tempnam "+
"tmpfile touch umask unlink "+
"checkdate date_add date_create_from_format date_create date_date_set date_default_timezone_get date_default_timezone_set date_diff date_format "+
"date_get_last_errors date_interval_create_from_date_string date_interval_format date_isodate_set date_modify date_offset_get date_parse_from_format "+
"date_parse date_sub date_sun_info date_sunrise date_sunset date_time_set date_timestamp_get date_timestamp_set date_timezone_get date_timezone_set "+
"date getdate gettimeofday gmdate gmmktime gmstrftime idate localtime microtime mktime strftime strptime strtotime time "+
"abs acos acosh asin asinh atan2 atan atanh base_convert bindec ceil cos cosh decbin dechex decoct deg2rad exp expm1 floor fmod getrandmax hexdec "+
"hypot is_finite is_infinite is_nan lcg_value log10 log1p log max min mt_getrandmax mt_rand mt_srand octdec pi pow rad2deg rand round sin sinh sqrt "+
"srand tan tanh "+
"call_user_method_array call_user_method class_alias class_exists get_called_class get_class_methods get_class_vars get_class get_declared_classes "+
"get_declared_interfaces get_declared_traits get_object_vars get_parent_class interface_exists is_a is_subclass_of method_exists property_exists trait_exists "+
"boolval debug_zval_dump doubleval empty floatval get_defined_vars get_resource_type gettype import_request_variables intval is_array "+
"is_bool is_callable is_double is_float is_int is_integer is_long is_null is_numeric is_object is_real is_resource is_scalar is_string isset "+
"print_r serialize settype strval unserialize unset var_dump var_export "+
"flush ob_clean ob_end_clean ob_end_flush ob_flush ob_get_clean ob_get_contents ob_get_flush ob_get_length ob_get_level ob_get_status ob_gzhandler "+
"ob_implicit_flush ob_list_handlers ob_start session_cache_expire session_cache_limiter session_commit session_decode session_destroy session_encode "+
"session_get_cookie_params session_id session_is_registered session_module_name session_name session_regenerate_id session_register_shutdown "+
"session_register session_save_path session_set_cookie_params session_set_save_handler session_start session_status session_unregister session_unset "+
"session_write_close base64_decode base64_encode get_headers get_meta_tags http_build_query parse_url rawurldecode rawurlencode urldecode urlencode "+
//Popular Logiks Functions
"_cache _css _skin _js _dataBus _db _dbData _dbFetch _dbFree _dbQuery _dbtable _ling _link _url _site _msg _date _pDate _time _timestamp _randomid "+
"_replace  _template _templateData "+
"cleanCode cleanText cleanForDB clean htmlClean Strip array_is_associative split_by_commas splitByCaps toTitle replaceFromEnviroment getHash "+
"println printArray getConfig loadFeature "+
"setConfig setSettings setSiteSettings registerRole registerSettings registerSiteSettings removeSettings removeSiteSettings "+
"findSettings findSiteSettings getSiteSettingsForScope getSiteSettings getSettingsForScope getSettings "+
"updateUser createUser checkUserID initUserCredentials flushPermissions  session_check checkUserRoles "+
"redirectToApp isLocalhost isLinkAccessable isBlacklisted isAdminSite checkBlacklist checkDevMode checkUserSiteAccess user_admin_check "+
"runHooks deleteCookies createTimeStamp getPageCacheFile getFunctionCaller logoutSession get_handlers "+
"loadHelpers loadModule loadModuleLib loadModules loadAllWidgets loadWidget helper_exists checkModule checkWidget "+
"loadAllMedia loadMedia loadMediaList loadContent loadTheme "+
"getBasePath getConfigPath getRelativePath getRootPath getWebPath getRequestPath getRelativePathToROOT getLocation "+
"getServiceCMD getSessionSite getUserList getUserInfo getUserID getUserDevice getUserDeviceType "
		).split(" ");

	CodeMirror.phpHints = function(editor) {
			var cur = editor.getCursor();
			var token = editor.getTokenAt(cur);
			var found=[];
			if(token==null || token.string.trim().length<=0) {
				return {list: [],
					from: {line: cur.line, ch: token.start},
					to: {line: cur.line, ch: token.end}};
			}
			var start = token.string.trim().toLowerCase();
			phpKeywords.forEach(function(str) {
					if (str.indexOf(start) == 0 && found.indexOf(str)<0) found.push(str);
				});
			return {list: found,
				from: {line: cur.line, ch: token.start},
				to: {line: cur.line, ch: token.end}};
		};
})();
