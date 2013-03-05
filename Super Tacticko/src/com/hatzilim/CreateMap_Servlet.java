package com.hatzilim;
import static com.googlecode.objectify.ObjectifyService.ofy;

import java.io.IOException;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import com.google.gson.Gson;
import com.googlecode.objectify.ObjectifyService;

@SuppressWarnings("serial")
public class CreateMap_Servlet extends HttpServlet {
	static final int width = 30;
	static final int height = 30;
	public void doGet(HttpServletRequest req, HttpServletResponse resp) throws IOException {
		req.setAttribute("width", width);
		req.setAttribute("height", height);
		
		req.setAttribute("bodyClass", "create-page");
		try { 
			getServletContext().getRequestDispatcher("/game.jsp").forward(req, resp); 
		} catch (ServletException e) {
			System.out.println (e.getMessage());
		}
	}
	
	
	public void doPost(HttpServletRequest req, HttpServletResponse resp) throws IOException {
		if ( req.getParameter("map") != null ) {
			ObjectifyService.register(Map.class);
			
			int[][] newMap = new int[0][0];
			Gson gson = new Gson();
			newMap = gson.fromJson (req.getParameter("map"), newMap.getClass());
			Map map = new Map (newMap);
			
			ofy().save().entity(map).now();
			
			resp.setContentType("text/plain");
			resp.getWriter().println( map.getId() );
			
		}
	}
}
