#ifndef RESTAURANTMANAGER_H
#define RESTAURANTMANAGER_H

#include <iostream>
#include <string>
#include <vector>
#include <algorithm>
#include "../models/Restaurant.h"
using namespace std;

class RestaurantManager {
private:
    vector<Restaurant*> restaurants;
    static RestaurantManager* instance;

    RestaurantManager() = default; // Private constructor for singleton pattern

public:
    static RestaurantManager* getInstance() {
        if(!instance) {
            instance = new RestaurantManager();
        }
        return instance;
    }

    void addRestaurant(Restaurant* r){
        restaurants.push_back(r);
    }

    vector<Restaurant*> searchByLocation(string loc) {
        vector<Restaurant*> result;
        transform(loc.begin(),loc.end(),loc.begin(),::tolower);
        for(auto r : restaurants){
            string rl = r->getLocation();
            transform(rl.begin(), rl.end(), rl.begin(), ::tolower);
            if(rl == loc){
                result.push_back(r);
            }
        }
        return result;
    }
};

RestaurantManager* RestaurantManager::instance = nullptr;


#endif
