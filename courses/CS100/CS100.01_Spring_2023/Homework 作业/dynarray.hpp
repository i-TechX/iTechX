#ifndef DYNARRAY_HPP
#define DYNARRAY_HPP 1

#include <algorithm>
#include <cstddef>
#include <iostream>
#include <stdexcept>
#include <type_traits>
#include <utility>

// Note: This is for exposition only.
// This is only a demonstration for how to implement a RandomAccessIterator.
// For our very simple Dynarray, we can simply use T* as the iterator and use
// const T* as the const_iterator.
template <typename T, bool is_const>
class DynarrayIterator {
 public:
  using value_type = T; // 9/A
  using reference = std::conditional_t<is_const, const T &, T &>; // 9/B
  using pointer = std::conditional_t<is_const, const T *, T *>;
  using difference_type = std::ptrdiff_t;
  using iterator_category = std::random_access_iterator_tag;

 private:
  pointer m_current{}; // 8/D

 public:
  DynarrayIterator() = default;

  explicit DynarrayIterator(pointer p) : m_current{p} {}

  // 10/A
  template <typename Other,
            typename = std::enable_if_t<
                is_const && std::is_same_v<Other, DynarrayIterator<T, false>>>>
  DynarrayIterator(const Other &other) : m_current{other.m_current} {}

  pointer base() const {
    return m_current;
  }

  // InputIterator requirements
  reference operator*() const { // 9/C
    return *m_current;
  }
  pointer operator->() const {
    return m_current;
  }
  DynarrayIterator &operator++() {
    ++m_current;
    return *this;
  }
  DynarrayIterator operator++(int) {
    auto tmp = *this;
    ++*this;
    return tmp;
  }

  // BidirectionalIterator requirements
  DynarrayIterator &operator--() {
    --m_current;
    return *this;
  }
  DynarrayIterator operator--(int) {
    auto tmp = *this;
    --*this;
    return tmp;
  }

  // RandomAccessIterator requirements
  DynarrayIterator &operator+=(difference_type n) {
    m_current += n;
    return *this;
  }
  DynarrayIterator &operator-=(difference_type n) {
    return *this += -n;
  }
  reference operator[](difference_type n) const { // 9/D
    return m_current[n];
  }
};

// iter + n
template <typename T, bool C>
inline DynarrayIterator<T, C>
operator+(DynarrayIterator<T, C> iter,
          typename DynarrayIterator<T, C>::difference_type n) {
  return iter += n;
}
// iter - n
template <typename T, bool C>
inline DynarrayIterator<T, C>
operator-(DynarrayIterator<T, C> iter,
          typename DynarrayIterator<T, C>::difference_type n) {
  return iter -= n;
}
// n + iter
template <typename T, bool C>
inline DynarrayIterator<T, C>
operator+(typename DynarrayIterator<T, C>::difference_type n,
          const DynarrayIterator<T, C> &iter) {
  return iter + n;
}
// iter1 - iter2
template <typename T, bool C1, bool C2>
inline typename DynarrayIterator<T, C1>::difference_type
operator-(const DynarrayIterator<T, C1> &lhs,
          const DynarrayIterator<T, C2> &rhs) {
  return lhs.base() - rhs.base();
}

// ==, !=, <, <=, >, >=
template <typename T, bool C1, bool C2>
bool operator==(const DynarrayIterator<T, C1> &lhs,
                const DynarrayIterator<T, C2> &rhs) {
  return lhs.base() == rhs.base();
}
template <typename T, bool C1, bool C2>
inline bool operator<(const DynarrayIterator<T, C1> &lhs,
                      const DynarrayIterator<T, C2> &rhs) {
  return lhs.base() < rhs.base();
}
template <typename T, bool C1, bool C2>
bool operator!=(const DynarrayIterator<T, C1> &lhs,
                const DynarrayIterator<T, C2> &rhs) {
  return !(lhs == rhs);
}
template <typename T, bool C1, bool C2>
inline bool operator>(const DynarrayIterator<T, C1> &lhs,
                      const DynarrayIterator<T, C2> &rhs) {
  return rhs < lhs;
}
template <typename T, bool C1, bool C2>
inline bool operator<=(const DynarrayIterator<T, C1> &lhs,
                       const DynarrayIterator<T, C2> &rhs) {
  return !(lhs > rhs);
}
template <typename T, bool C1, bool C2>
inline bool operator>=(const DynarrayIterator<T, C1> &lhs,
                       const DynarrayIterator<T, C2> &rhs) {
  return !(lhs < rhs);
}

template <typename T>
class Dynarray {
 public:
  static_assert(!std::is_const_v<T>,
                "Dynarray must have a non-const value_type."); // 9

  using size_type = std::size_t;
  using value_type = T;
  using pointer = T *;
  using reference = T &;
  using const_pointer = const T *;
  using const_reference = const T &;

  using iterator = DynarrayIterator<T, false>;
  using const_iterator = DynarrayIterator<T, true>;
  using reverse_iterator = std::reverse_iterator<iterator>;
  using const_reverse_iterator = std::reverse_iterator<const_iterator>;

  static const size_type npos = -1;

 private:
  size_type m_length;
  pointer m_storage;

 public:
  explicit Dynarray(size_type n)
      : m_length{n}, m_storage{new value_type[n]{}} {}
  Dynarray(size_type n, const value_type &x)
      : m_length{n}, m_storage{new value_type[n]} {
    std::fill_n(m_storage, n, x);
  }
  Dynarray() : m_length{0}, m_storage{nullptr} {}

  // Construct from a pair of ForwardIterators [begin, end)
  // 10/C
  template <
      typename ForwardIterator,
      typename = std::enable_if_t<std::is_base_of_v<
          std::forward_iterator_tag,
          typename std::iterator_traits<ForwardIterator>::iterator_category>>>
  Dynarray(ForwardIterator begin, ForwardIterator end)
      : m_length(std::distance(begin, end)),
        m_storage{new value_type[m_length]} {
    std::copy(begin, end, m_storage);
  }
  Dynarray(const Dynarray &other)
      : m_length{other.size()}, m_storage{new value_type[m_length]} {
    std::copy_n(m_storage, m_length, other.m_storage);
  }
  Dynarray(Dynarray &&other) noexcept
      : m_length{std::exchange(other.m_length, 0)},
        m_storage{std::exchange(other.m_storage, nullptr)} {}
  void swap(Dynarray &other) noexcept {
    using std::swap;
    swap(m_length, other.m_length);
    swap(m_storage, other.m_storage);
  }
  Dynarray &operator=(Dynarray other) noexcept { // 6/A, 6/B
    swap(other);
    return *this;
  }
  ~Dynarray() {
    delete[] m_storage;
  }

  size_type size() const {
    return m_length;
  }
  bool empty() const {
    return m_length == 0u;
  }
  reference at(size_type n) {
    return const_cast<reference>(static_cast<const Dynarray *>(this)->at(n));
  }
  const_reference at(size_type n) const {
    if (n >= m_length)
      throw std::out_of_range{"Dynarray index out of range."};
    return m_storage[n];
  }
  reference operator[](size_type n) {
    return m_storage[n];
  }
  const_reference operator[](size_type n) const {
    return m_storage[n];
  }

  size_type find(const value_type &x, size_type pos = 0) const {
    while (pos < size()) {
      if (this->operator[](pos) == x)
        return pos;
      ++pos;
    }
    return npos;
  }

  iterator begin() { // 6/C
    return iterator(m_storage);
  }
  const_iterator begin() const { // 6/C
    return const_iterator(m_storage);
  }
  const_iterator cbegin() const { // 6/C
    return begin();
  }
  iterator end() {
    return iterator(m_storage + m_length);
  }
  const_iterator end() const {
    return const_iterator(m_storage + m_length);
  }
  const_iterator cend() const {
    return end();
  }
  reverse_iterator rbegin() {
    return reverse_iterator(end());
  }
  const_reverse_iterator rbegin() const {
    return const_reverse_iterator(end());
  }
  const_reverse_iterator crbegin() const {
    return rbegin();
  }
  reverse_iterator rend() {
    return reverse_iterator(begin());
  }
  const_reverse_iterator rend() const {
    return const_reverse_iterator(begin());
  }
  const_reverse_iterator crend() const {
    return rend();
  }
};

// C++17 CTAD deduction guide
// 10/D
template <typename ForwardIterator>
Dynarray(ForwardIterator, ForwardIterator)
    -> Dynarray<typename std::iterator_traits<ForwardIterator>::value_type>;

template <typename T>
inline bool operator==(const Dynarray<T> &lhs, const Dynarray<T> &rhs) {
  if (lhs.size() != rhs.size())
    return false;
  for (std::size_t i = 0; i != lhs.size(); ++i)
    if (!(lhs[i] == rhs[i]))
      return false;
  return true;
}

template <typename T> // 7/A
inline bool operator<(const Dynarray<T> &lhs, const Dynarray<T> &rhs) {
  for (std::size_t i = 0; i != lhs.size() && i != rhs.size(); ++i) {
    if (lhs[i] < rhs[i])
      return true;
    if (rhs[i] < lhs[i])
      return false;
  }
  return lhs.size() < rhs.size();
}

template <typename T>
inline bool operator!=(const Dynarray<T> &lhs, const Dynarray<T> &rhs) {
  return !(lhs == rhs);
}

template <typename T>
inline bool operator>(const Dynarray<T> &lhs, const Dynarray<T> &rhs) {
  return rhs < lhs;
}

template <typename T>
inline bool operator<=(const Dynarray<T> &lhs, const Dynarray<T> &rhs) {
  return !(lhs > rhs);
}

template <typename T>
inline bool operator>=(const Dynarray<T> &lhs, const Dynarray<T> &rhs) {
  return !(lhs < rhs);
}

template <typename T> // 7/B, 7/C
inline std::ostream &operator<<(std::ostream &os, const Dynarray<T> &a) {
  os << '[';
  if (!a.empty()) {
    os << a[0];
    for (std::size_t i = 1; i < a.size(); ++i)
      os << ", " << a[i];
  }
  return os << ']';
}

#endif // DYNARRAY_HPP