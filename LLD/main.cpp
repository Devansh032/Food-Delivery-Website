#include<iostream>
#include "TomatoApp.h"
using namespace std;

int main() {
    TomatoApp* tomato = new TomatoApp();
    
    // simulate a user coming in (happy flow)
    User* user = new User(101,"Avi","Delhi");
    cout<<"User : "<< user->getName() << " is active" << endl;

    // user searches for restaurants by location
    vector<Restaurant*> restaurantList = tomato->searchRestaurant("Delhi");

    if(restaurantList.empty()){
        cout<<"No restaurants found in the specified location." << endl;
        return 0;
    }
    cout<<"Restaurants found in the specified location:" << endl;
    for(auto restaurant : restaurantList) {
        cout << " -- " << restaurant->getName() <<endl;
    }
    // user selects a restaurant
    tomato->selectRestaurant(user,restaurantList[0]);
    cout<<"Selected Restaurant: " << restaurantList[0]->getName() << endl;

    tomato->addToCart(user,"P1");
    tomato->addToCart(user,"P2");

    tomato->printUserCart(user);

    Order* order = tomato->checkoutNow(user,"Delivery",new UpiPaymentStrategy("1234567890"));

    tomato->payForOrder(user,order);

    delete tomato;
    delete user;

    return 0;
}