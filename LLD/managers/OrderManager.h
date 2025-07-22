#ifndef ORDER_MANAGER_H
#define ORDER_MANAGER_H
#include<vector>
#include<iostream>
#include "../models/Order.h"
using namespace std;

class OrderManager{
private : 
    vector<Order*> orders;
    static OrderManager* manager;
    static OrderManager* instance;

    OrderManager(){
        //private constructor
    }

public :
    static OrderManager* getInstance(){
        if(!instance){
            instance = new OrderManager();
        }
        return instance;
    }
    void addOrder(Order* order){
        orders.push_back(order);
    }

    void listOrder(){
        cout<<"\n---All Orders ---" << endl;
        for(auto order : orders){
            cout<<order->getType() << "order for "<<order->getUser()->getName()
                <<" | Total: $" << order->getTotal() 
                <<" | At : "<< order->getScheduled()<<endl;
        }
    }

};
OrderManager* OrderManager::instance = nullptr;
#endif