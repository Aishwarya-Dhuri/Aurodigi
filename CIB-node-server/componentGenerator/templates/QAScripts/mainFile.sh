function bbe<%=masterNameClassCase%>($recordType, $action, $validation, <%=fields%> $duplicate)
{
	try {
<%=sectionHeaderAsserts%>
		var $text_field = _collect("_textbox", "/.*/", _in(_div("accordContent dataContent")));

		if ($recordType == null) {
			if (_isVisible($_LINK_SUBMIT)) {
				var $linkD = _getAttribute(_link(1, _in(_div("btnsCenterGroup[2]"))), "disabled");
				_assertEqual("disabled", $linkD);
			}
		}
		
		<%=fieldAsserts%>

		if ($action == "Submit") {
			if ($recordType == null) {
				_click($_LINK_SUBMIT);
			} else {
				_click($_LINK_UPDATE);
			}
			if (_isVisible(_span("Only maker can resubmit or accept the rejection."))) {
				_log(_span("Only maker can resubmit or accept the rejection."));
				_wait(200);
				//_click($_BUTTON_BACK);
			}<%=uniqueFieldsErrorConditions%>else {
				if ($recordType == null) {
					_assertVisible(_heading1("Success"));
					_assertVisible(_heading2("<%=MasterName%> created successfully."));
					_click(_button(0, _in(_div("successDetails"))));
				} else {
					$<%=uniqueField%> = _readFile("<%=uniqueField%>.txt");
					_assertVisible(_heading1("Success"));
					_assertVisible(_heading2("<%=MasterName%> updated successfully."));
					_click(_button(0, _in(_div("successDetails"))));
				}
				_writeFile($<%=uniqueField%>, "<%=uniqueField%>.txt", true);
				var $data = [];
				$data[0] = [<%=fields%>];
				_writeFile($data, "newData.csv", true);
				_click($_DIV_PENDING);
				if (_condition(_isVisible(_div("listing_nav_items ng-scope active")) == true)) {

				} else {
					_click($_DIV_PENDING);
				}
				bbeSearch("<%=listingOFieldName%>", $<%=listingOField%>);
				$<%=listingOField%> = $<%=listingOField%>.toUpperCase();
				_assertVisible(_cell($<%=listingOField%>));
				//Verify Link
				_assertVisible($_LINK_VIEW, _near(_cell($<%=listingOField%>)));
				_assertVisible($_LINK_EDIT, _near(_cell($<%=listingOField%>)));
				if (_isVisible(_italic("fa icon-more"))) {
					_click(_italic("fa icon-more"));
					_assertVisible(_link("Delete", _near(_cell($<%=listingOField%>))));
				}
			}
		} else if ($action == "Cancel") {
			_click($_LINK_CANCEL1);
		}
	} catch ($e) {
		_debug($e);
	}
}

function view<%=masterNameClassCase%>($file, $previouData) {
	try {
		var $userinfo = [];
		var $userinfo = _readFile(_resolvePath($file));
		var $txtFile = $userinfo.split(",");
		if ($previouData == "Y") {
			_click($_BUTTON_VIEWPREVIOUSDATA);
			_wait(300);
			<%=viewPreviousDataAsserts%>
			_click($_BUTTON_CLOSE2);
		} else {
			<%=viewAsserts%>
		}
	} catch ($e) {
		_debug($e);
	}
}