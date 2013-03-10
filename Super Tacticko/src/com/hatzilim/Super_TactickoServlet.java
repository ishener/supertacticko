package com.hatzilim;
import static com.googlecode.objectify.ObjectifyService.ofy;

import java.io.IOException;
import java.util.Random;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import com.google.appengine.api.channel.ChannelMessage;
import com.google.appengine.api.channel.ChannelService;
import com.google.appengine.api.channel.ChannelServiceFactory;
import com.googlecode.objectify.ObjectifyService;

@SuppressWarnings("serial")
public class Super_TactickoServlet extends HttpServlet {
	static final int width = 30;
	static final int height = 30;
	static final Long defaultMap = 17L;
	
	public void doGet(HttpServletRequest req, HttpServletResponse resp) throws IOException {
		ObjectifyService.register(Map.class);
		ObjectifyService.register(Game.class);
		
		req.setAttribute("width", width);
		req.setAttribute("height", height);
		
		ChannelService channelService = ChannelServiceFactory.getChannelService();
		String clientId = req.getRemoteAddr() + req.getHeader("User-Agent").toLowerCase().indexOf("chrome");
		
		
		String[] path = req.getRequestURI().split("/");
		if (path.length > 2) {
			// the user is either the creator of the game who just got redirect, or the invited who got here from a link
			
			String gamekey = path[2];
			Game g = ofy().load().type(Game.class).id(Long.parseLong(gamekey)).get();
			
			if (g == null) {
				// invalid game
				resp.setStatus(401);
				return;
			}
			
			String token = channelService.createChannel( clientId );
			req.setAttribute("token", token);
			req.setAttribute("clientId", clientId);
			System.out.println("created token " + token);
			
			String remoteStatus = null;
			if ( g.getPlayer1().equals(clientId) ) {
				// the current player is player 1
				if (g.getPlayer2() == null) {
					remoteStatus = "invite";
				} else {
					// the two players are already playing...
					// TODO: make a feature to save the game
				}
				req.setAttribute("map", g.getMap().getMap());
			} else {
				if (g.getPlayer2() == null || g.getPlayer2().equals(clientId)) {
					// the user is the invited. set things up
					remoteStatus = "joined";
					g.setPlayer2(clientId);
					g.setWhoseTurn(clientId);
					g.updateState(clientId, "joined");
					
//					if (g.getPlayer2() == null)
						ofy().save().entity(g).now();
					
				} else {
					// the user is a viewer 
				}
				req.setAttribute("map", g.getMap().getReversedMap());
			}
				
			
//			Map map = g.getMap();
//			req.setAttribute("map", map.getMap());
			req.setAttribute("remoteStatus", remoteStatus);
			try { 
				getServletContext().getRequestDispatcher("/game.jsp").forward(req, resp); 
			} catch (ServletException e) {
				System.out.println (e.getMessage());
			}
			
			
			
			
		} else {
			// the user wants to create a new game, either from a specified map or the default map
			
			// first determine and load the map we are using
			Long mapId = (req.getParameter("map") != null) ? (Long.parseLong(req.getParameter("map"))) : (defaultMap);
			Map map = ofy().load().type(Map.class).id(mapId).get();
			
			// create a unique game key
			Random rand = new Random(); 
			Long gamekey = Math.abs( rand.nextLong() );
			
			Game g = new Game (gamekey);
			g.setPlayer1(clientId);
			g.setMap(map);
			ofy().save().entity(g).now();
			resp.sendRedirect("/game/" + (gamekey));
		}
		
		
	}
	
	public void doPost(HttpServletRequest req, HttpServletResponse resp) throws IOException {
		try {
			ObjectifyService.register(Map.class);
			ObjectifyService.register(Game.class);
			
			String action = req.getParameter("action");
			String gamekey = req.getParameter("gamekey");
			String clientId = req.getParameter("player");
			
			System.out.println("updating status. action: " + action);
			
			Game g = ofy().load().type(Game.class).id(Long.parseLong(gamekey)).get();
			g.updateState(clientId, action);
			
		} catch (NullPointerException e) {
			// bad request
			System.out.println (e.getMessage());
		}
	}
}
