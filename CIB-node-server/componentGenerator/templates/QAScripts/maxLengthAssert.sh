_setValue($text_field[<%=fieldIndex%>], "<%=fieldMaxLengthText%>");
				_wait(100);
				_assertEqual(<%=fieldMaxLength%>, _getText($text_field[<%=fieldIndex%>]).length);
				_log("Maximum length of <%=fieldName%> is <%=fieldMaxLength%>");
				