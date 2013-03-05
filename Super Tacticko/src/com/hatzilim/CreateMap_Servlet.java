package com.hatzilim;
import static com.googlecode.objectify.ObjectifyService.ofy;

import java.io.IOException;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import com.google.gson.Gson;
import com.googlecode.objectify.ObjectifyService;

@SuppressWarnings("serial")
public class CreateMap_Servlet extends HttpServlet {
	public void doGet(HttpServletRequest req, HttpServletResponse resp) throws IOException {
		ObjectifyService.register(Map.class);
		
		Map m = ofy().load().type(Map.class).id(4).get();
		
		System.out.println(Arrays.deepToString(m.getMap()));
	}
	
	
	public void doPost(HttpServletRequest req, HttpServletResponse resp) throws IOException {
		if ( req.getParameter("map") != null ) {
			ObjectifyService.register(Map.class);
			
			int[][] newMap = new int[0][0];
//			List<List<Integer>> newMap = new ArrayList<List<Integer>>();
			Gson gson = new Gson();
			newMap = gson.fromJson (req.getParameter("map"), newMap.getClass());
			Map map = new Map (newMap);
			
			ofy().save().entity(map).now();
			
			resp.setContentType("text/plain");
			resp.getWriter().println( map.getId() );
			
//			System.out.println( Arrays.deepToString(map.getMap()) );
		}
	}
}
