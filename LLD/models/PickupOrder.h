#ifndef PICKUP_ORDER_H
#define PCKUP_ORDER_H

#include "../models/Order.h"
using namespace std;

class PickupOrder : public Order{
private:
    string restaurantAddress;
public :
    PickupOrder(){
        restaurantAddress = "";
    }
    string getType() const override{
        return "Pickup";
    }
    void setRestaurantAddress(const string& addr){
        restaurantAddress = addr;
    }
    string getRestaurantAddress() const {
        return restaurantAddress;
    }
};
#endif