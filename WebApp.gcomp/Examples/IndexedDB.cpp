#include <emscripten.h>


int main() {
  int hello = 7;
  emscripten_idb_async_store("THE_DB", "the_secret", &hello, sizeof(int), 0, 0, 0);
  return 0;
}