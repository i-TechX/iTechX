#include <stdio.h>
#include <vector>

class Driver {
 private:
  int _id;
};

class Engine {
 public:
  Engine();
  Engine( double hp );
 private:
  double _hp;
};

Engine::Engine() {}
Engine::Engine(double hp) : _hp(hp) {}

class Car {
 public:
  //Car();  //-> does not work anymore!
  Car( Driver & driver );
 private:
  Driver & m_driver;
  Engine m_engine;
  std::vector<int> m_vec;
};

//Car::Car() {}; //-> does not work anymore!
Car::Car( Driver & driver ) : m_driver(driver), m_vec(10) {

  delete &(m_driver);
}


int main() {
  
  Driver driver1;
  Car myCar(driver1);

  Car *a = new Car();

}