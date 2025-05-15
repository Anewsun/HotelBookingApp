import React from 'react';
import Icon from 'react-native-vector-icons/FontAwesome';

export const getAmenityIcon = (icon) => {
  switch (icon) {
    // Hotel amenities
    case "pool-icon":
      return <Icon name="water" size={25} color="#000" />;
    case "gym-icon":
      return <Icon name="dumbbell" size={25} color="#000" />;
    case "restaurant-icon":
      return <Icon name="utensils" size={25} color="#000" />;
    case "spa-icon":
      return <Icon name="heart" size={25} color="#000" />;
    case "bar-icon":
      return <Icon name="wine-glass" size={25} color="#000" />;
    case "lobby-icon":
      return <Icon name="couch" size={25} color="#000" />;
    case "laundry-icon":
      return <Icon name="tshirt" size={25} color="#000" />;
    case "parking-icon":
      return <Icon name="car" size={25} color="#000" />;
    case "conference-icon":
      return <Icon name="chalkboard-teacher" size={25} color="#000" />;
    case "tennis-icon":
      return <Icon name="sports-tennis" size={25} color="#000" />;
    case "playground-icon":
      return <Icon name="play-circle" size={25} color="#000" />;
    case "shuttle-icon":
      return <Icon name="airplane" size={25} color="#000" />;
    case "reception-icon":
      return <Icon name="receipt" size={25} color="#000" />;
    case "elevator-icon":
      return <Icon name="building" size={25} color="#000" />;
    case "smoking-icon":
      return <Icon name="smoking" size={25} color="#000" />;
    case "room-service-icon":
      return <Icon name="bell" size={25} color="#000" />;

    // Room amenities
    case "wifi-icon":
      return <Icon name="wifi" size={25} color="#000" />;
    case "ac-icon":
      return <Icon name="snowflake" size={25} color="#000" />;
    case "tv-icon":
      return <Icon name="tv" size={25} color="#000" />;
    case "minibar-icon":
      return <Icon name="glass-martini" size={25} color="#000" />;
    case "bath-icon":
      return <Icon name="bath" size={25} color="#000" />;
    case "shower-icon":
      return <Icon name="shower" size={25} color="#000" />;
    case "hair-dryer-icon":
      return <Icon name="fan" size={25} color="#000" />;
    case "desk-icon":
      return <Icon name="desktop" size={25} color="#000" />;
    case "wardrobe-icon":
      return <Icon name="closet" size={25} color="#000" />;
    case "dressing-table-icon":
      return <Icon name="table" size={25} color="#000" />;
    case "phone-icon":
      return <Icon name="phone" size={25} color="#000" />;
    case "safe-icon":
      return <Icon name="lock" size={25} color="#000" />;
    case "balcony-icon":
      return <Icon name="sun" size={25} color="#000" />;
    case "fridge-icon":
      return <Icon name="snowflake" size={25} color="#000" />;
    case "kettle-icon":
      return <Icon name="coffee" size={25} color="#000" />;
    case "coffee-set-icon":
      return <Icon name="coffee" size={25} color="#000" />;
    default:
      return null;
  }
};
