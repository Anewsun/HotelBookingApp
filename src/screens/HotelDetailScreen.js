import React from "react";
import { ScrollView, SafeAreaView } from "react-native";
import HotelHeader from "../components/HotelHeader";
import HotelDetail from "../components/HotelDetail";
import PropertyFacilities from "../components/PropertyFacilities";
import RoomTypeSelection from "../components/RoomTypeSelection";
import ReviewsSection from "../components/ReviewsSection";

const HotelDetailScreen = () => {
    return (
        <SafeAreaView style={{ flex: 1 }}>
            <ScrollView>
                <HotelHeader />
                <HotelDetail />
                <PropertyFacilities />
                <RoomTypeSelection />
                <ReviewsSection />
            </ScrollView>
        </SafeAreaView>
    );
};

export default HotelDetailScreen;
