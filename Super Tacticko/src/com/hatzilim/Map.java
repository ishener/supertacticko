package com.hatzilim;


import com.googlecode.objectify.annotation.Entity;
import com.googlecode.objectify.annotation.Id;
import com.googlecode.objectify.annotation.Serialize;

@Entity
public class Map {
	@Id Long id;
	@Serialize int[][] map;
	
	public Map () {
		
	}
	
	public Map (int[][] newMap) {
		this.map = newMap;
	}

	public Long getId() {
		return id;
	}

	public void setId(Long id) {
		this.id = id;
	}
	
	com.googlecode.objectify.Key<Map> getKey() {
        return com.googlecode.objectify.Key.create(Map.class, id); 
    }

	public int[][] getMap() {
		return map;
	}

	public void setMap(int[][] map) {
		this.map = map;
	}
}
