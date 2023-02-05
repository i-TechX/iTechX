#include <stdlib.h>
#include <iostream>

class IntegerArray {
 public:
  IntegerArray( int initialArraySize ) {
    m_data = new int[initialArraySize];
    m_size = initialArraySize;
    for( int i = 0; i < initialArraySize; i++ )
      m_data[i] = 0;
  }
  //deep copy constructor
  IntegerArray( const IntegerArray & original ) {
    m_size = original.m_size;
    m_data = new int[original.m_size];
    for( int i = 0; i < original.m_size; i++ )
      m_data[i] = original.m_data[i];
  }
  ~IntegerArray() {
    delete [] m_data;
  }

  void resizeArray( int newArraySize ) {
    int * newDataPtr = new int[newArraySize];
    for( int i = 0; i < newArraySize; i++ ) {
      if( i >= m_size )
        newDataPtr[i] = 0;
      else
        newDataPtr[i] = m_data[i];
    }
    delete [] m_data;
    m_data = newDataPtr;
    m_size = newArraySize;
  }

  IntegerArray operator+( const IntegerArray & arg ) {
    IntegerArray result(0);
    if( this->m_size < arg.m_size )
      result.resizeArray(arg.m_size);
    else
      result.resizeArray(this->m_size);

    for( int i = 0; i < result.m_size; i++ ) {
      if( i < this->m_size )
        result.m_data[i] += this->m_data[i];
      if( i < arg.m_size )
        result.m_data[i] += arg.m_data[i];
    }

    return result;
  }

  int * m_data;
  int m_size;
};

int main() {
  int arraySize = 10;
  IntegerArray myArray(arraySize);
  arraySize = 20;
  myArray.resizeArray(20);

  if( true ) {
    IntegerArray b = myArray; //same as IntegerArray b(myArray);
  }

  for( int i = 0; i < myArray.m_size; i++ )
    std::cout << myArray.m_data[i] << " ";
  std::cout << std::endl;

  IntegerArray myArray1(arraySize);
  IntegerArray myArray2(arraySize);

  //IntegerArray myArraySum = myArray1.add(myArray2);
  IntegerArray myArraySum = myArray1 + myArray2;

  return 0;
}