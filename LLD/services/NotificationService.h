#ifndef NOTIFICATION_SERVICE_H
#define NOTIFICATION_SERVICE_H

#include <iostream>
#include "../models/Order.h"
using namespace std;

class NotificationService {
public :
    static void notify(Order* order) {
        cout<<"\nNotification : New"<<order->getType() << "order placed!"<<endl;
        cout<<"---------------------------"<<endl;
        cout<<"Order Id : "<<order->getOrderId() <<endl;
        cout<<"Customer : " << order->getUser()->getName()<<endl;
        cout<<"Restaurant : " <<order->getRestaurant()->getName()<<endl;
        cout<<"items ordered"<<endl;

        const vector<MenuItem>& items = order->getItems();
        for(const auto& item : items){
            cout<<" -" << item.getName() << "($"<<item.getPrice()<<" )\n";
        }
        cout<<"Total : $" << order->getTotal()<<endl;
        cout<<"Scheduled for : "<<order->getScheduled()<<endl;
        cout<<"Payment Done"<<endl;
        cout<<" -------------------------------------- "<<endl;
    }
};

#endif