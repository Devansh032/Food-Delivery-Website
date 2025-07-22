#ifndef ORDER_H
#define ORDER_H
#include<iostream>
#include<vector>
#include<string>
#include "User.h"
#include "Restaurant.h"
#include"MenuItem.h"
#include "../strategies/PaymentStrategy.h"
#include "../utils/TimeUtils.h"
using namespace std;

class Order{
protected :
    static int nextOrderId;
    int orderId;
    User* user;
    Restaurant* restaurant;
    vector<MenuItem> items;
    PaymentStrategy* paymentStrategy;
    double total;
    string scheduled;

public :
    Order(){
        user = nullptr;
        restaurant = nullptr;
        paymentStrategy = nullptr;
        total = 0.0;
        scheduled = "";
        orderId = ++nextOrderId;
    }
    virtual ~Order() {
        delete paymentStrategy;
    }

    bool processPayment(){
        if(paymentStrategy){
            paymentStrategy->pay(total);
            return true;
        }
        else{
            cout<<"Please choose a payment mode first"<<endl;
            return false;
        }
    }
    virtual string getType() const = 0;

    int getOrderId() const{
        return orderId;
    }

    void setUser(User* u){
        user = u;
    }

    User* getUser() const{
        return user;
    }

    void setRestaurant(Restaurant* r){
        restaurant = r;
    }

    Restaurant* getRestaurant() const{
        return restaurant;
    }

    void setItems(const vector<MenuItem>& its){
        items = its;
    }

    double getTotal(){
        total = 0;
        for(auto&i : items) total += i.getPrice();
    }

    void setTotal(double sum){
        total = sum;
    }

    const vector<MenuItem>& getItems() const{
        return items;
    }

    void setPaymentStrategy(PaymentStrategy* p){
        paymentStrategy = p;
    }

    string getScheduled(){
        return scheduled;
    }
    void setScheduled(const string& s){
        scheduled = s;
    }
};

int Order::nextOrderId = 0;

#endif