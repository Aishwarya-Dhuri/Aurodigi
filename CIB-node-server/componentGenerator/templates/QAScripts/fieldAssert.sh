//<%=fieldName%> validation
		if ($recordType == null) {
			var $<%=field%> = "SAHI" + Math.floor((Math.random() * 100) + 1) + "C" + Math.floor((Math.random() * 10) + 1);
			<%=uniqueFieldAssert%>	
			
			if ($validation == "Y") {
				<%=conditionAsserts%>
				_setValue($text_field[<%=fieldIndex%>], $<%=field%>);
			} else {
				_setValue($text_field[<%=fieldIndex%>], $<%=field%>);
			}
		} else {
			if (_condition($text_field[<%=fieldIndex%>].disabled == true)) {
				_assertEqual(true, $text_field[<%=fieldIndex%>].disabled);
			}
		}

		