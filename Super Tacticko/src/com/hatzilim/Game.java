package com.hatzilim;

import com.google.appengine.api.channel.ChannelMessage;
import com.google.appengine.api.channel.ChannelService;
import com.google.appengine.api.channel.ChannelServiceFactory;
import com.googlecode.objectify.Ref;
import com.googlecode.objectify.annotation.Entity;
import com.googlecode.objectify.annotation.Id;
import com.googlecode.objectify.annotation.Index;
import com.googlecode.objectify.annotation.Load;
import com.googlecode.objectify.annotation.Unindex;

@Entity
public class Game {
	@Id Long id;
	@Index String player1;
	@Index String player2;
	@Unindex String whoseTurn;
	@Load Ref<Map> map;
	
	public Game() {
		
	}
	
	public Game (Long id) {
		this.id = id;
	}

	public Long getId() {
		return id;
	}

	public void setId(Long id) {
		this.id = id;
	}
	
	com.googlecode.objectify.Key<Game> getKey() {
        return com.googlecode.objectify.Key.create(Game.class, id); 
    }

	public String getPlayer1() {
		return player1;
	}

	public void setPlayer1(String player1) {
		this.player1 = player1;
	}

	public String getPlayer2() {
		return player2;
	}

	public void setPlayer2(String player2) {
		this.player2 = player2;
	}

	public Map getMap() {
		if (map == null) return null;
		return map.get(); 
	}

	public String getWhoseTurn() {
		return whoseTurn;
	}

	public void setWhoseTurn(String whoseTurn) {
		this.whoseTurn = whoseTurn;
	}

	public void setMap(Map newMap) {
		if (newMap == null)
			map = null;
    	else
    		map = Ref.create(newMap.getKey(), newMap);
	}
	
	/* 
	 * every update consists of:
	 * 1. storing the update in the log
	 * 2. notifying the 2 players. (the acting player gets a confirmation)
	 */
	public void updateState (String player, String action) {
		String message = player + "/" + action;
		ChannelService channelService = ChannelServiceFactory.getChannelService();
	    channelService.sendMessage(new ChannelMessage(player1, message));
	    channelService.sendMessage(new ChannelMessage(player2, message));
	}
	
	
}
