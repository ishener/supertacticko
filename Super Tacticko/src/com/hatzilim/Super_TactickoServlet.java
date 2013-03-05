package com.hatzilim;
import java.io.IOException;

import javax.servlet.ServletException;
import javax.servlet.http.*;

@SuppressWarnings("serial")
public class Super_TactickoServlet extends HttpServlet {
	static final int width = 30;
	static final int height = 30;
	public void doGet(HttpServletRequest req, HttpServletResponse resp) throws IOException {
		req.setAttribute("width", width);
		req.setAttribute("height", height);
		
		if ( req.getParameter("create") != null ) {
			req.setAttribute("bodyClass", "create-page");
		}
		try { 
			getServletContext().getRequestDispatcher("/game.jsp").forward(req, resp); 
		} catch (ServletException e) {
			System.out.println (e.getMessage());
		}
	}
}
