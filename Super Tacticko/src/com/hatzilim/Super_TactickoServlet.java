package com.hatzilim;
import static com.googlecode.objectify.ObjectifyService.ofy;

import java.io.IOException;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import com.googlecode.objectify.ObjectifyService;

@SuppressWarnings("serial")
public class Super_TactickoServlet extends HttpServlet {
	static final int width = 30;
	static final int height = 30;
	public void doGet(HttpServletRequest req, HttpServletResponse resp) throws IOException {
		ObjectifyService.register(Map.class);
		req.setAttribute("width", width);
		req.setAttribute("height", height);
		if ( req.getParameter("map") != null ) {
			// start a new game with a specific map
			Long mapId = Long.parseLong(req.getParameter("map"));
			Map map = ofy().load().type(Map.class).id(mapId).get();
			req.setAttribute("map", map.getMap());
			try { 
				getServletContext().getRequestDispatcher("/game.jsp").forward(req, resp); 
			} catch (ServletException e) {
				System.out.println (e.getMessage());
			}
		}
	}
}
