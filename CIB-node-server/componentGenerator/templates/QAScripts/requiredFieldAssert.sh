_setValue($text_field[<%=fieldIndex%>], " ");
				_wait(100);
				_assertEqual("Provide <%=fieldName%>", _getText(_span(0, _in(_div("form-group[<%=fieldIndex%>]")))));
				_log("<%=fieldName%> is mandatory field.");
				