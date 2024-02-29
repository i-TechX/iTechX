#include <cctype>
#include <string>
#include <vector>

std::string strip(const std::string &s) {
  std::size_t begin = 0;
  while (begin < s.size() && std::isspace(s[begin]))
    ++begin;
  std::size_t end = s.size();
  while (end > begin && std::isspace(s[end - 1]))
    --end;
  return s.substr(begin, end - begin);
}

std::string join(const std::string &sep,
                 const std::vector<std::string> &strings) {
  if (strings.empty())
    return {};
  std::string ans = strings.front();
  for (std::size_t i = 1; i != strings.size(); ++i)
    ans += sep + strings[i];
  return ans;
}

std::vector<std::string> split(const std::string &str, const std::string &sep) {
  std::vector<std::string> result;
  auto len = str.size(), lenx = sep.size();
  size_t last = 0;
  for (size_t cur = str.find(sep); last < len && cur < len;
       last = cur + lenx, cur = str.find(sep, cur + lenx))
    result.push_back(str.substr(last, cur - last));
  result.push_back(str.substr(last, len));
  return result;
}

std::string swapcase(std::string str) {
  for (char &c : str) {
    if (std::isupper(c))
      c = std::tolower(c);
    else if (std::islower(c))
      c = std::toupper(c);
  }
  return str;
}
