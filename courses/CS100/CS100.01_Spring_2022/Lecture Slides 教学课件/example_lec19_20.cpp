#include <map>
#include <string>
#include <iostream>

using namespace std;

class Student {
 public:
  Student();
  Student( const string & name );
  virtual ~Student();

  string & name();
  unsigned int & id();
  unsigned int & score();

  void setName( const string & name );
  void setId( const unsigned int & id );
  void setScore( const unsigned int & score );
 
 private:
  string m_name;
  unsigned int m_id;
  unsigned int m_score;
};

Student::Student() {}
Student::Student( const string & name ) {
  m_name = name;
}
Student::~Student() {};

string &
Student::name() {
  return m_name;
}

unsigned int &
Student::id() {
  return m_id;
}

unsigned int &
Student::score() {
  return m_score;
}

void
Student::setName( const string & name ){
  m_name = name;
}

void
Student::setId( const unsigned int & id ){
  m_id = id;
}

void
Student::setScore( const unsigned int & score ) {
  m_score = score;
}

int main() {
  //create a few students to work with
  Student * tim = new Student(string("Tim"));
  tim->setId(27);
  tim->setScore(30);
  Student * ann = new Student(string("Ann"));
  ann->setId(43);
  ann->setScore(50);
  Student * jack = new Student(string("Jack"));
  jack->setId(92);
  jack->setScore(98);

  //fill original database where things are sorted by key name
  map<string,Student*> studentDB1;
  studentDB1["Tim"] = tim;
  studentDB1["Ann"] = ann;
  studentDB1["Jack"] = jack;

  //print out of the elements of the container in the stored order
  map<string,Student*>::iterator it = studentDB1.begin();
  unsigned int counter = 0;
  for( it; it != studentDB1.end(); it++ ) {
    cout << "Student " << ++counter << " from the database"
    << " is called " << it->second->name() << ". His ID is "
    << it->second->id() << ", and his current score is "
    << it->second->score() << "\n";
  }

  map<unsigned int,Student*> studentDB2;
  it = studentDB1.begin();
  while( it != studentDB1.end() ) {
    studentDB2[it->second->id()] = it->second;
    it++;
  }

  cout << endl;
  map<unsigned int,Student*>::iterator it2 = studentDB2.begin();
  counter = 0;
  for( it2; it2 != studentDB2.end(); it2++ ) {
    cout << "Student " << ++counter << " from the database"
    << " is called " << it2->second->name() << ". His ID is "
    << it2->second->id() << ", and his current score is "
    << it2->second->score() << "\n";
  }
}