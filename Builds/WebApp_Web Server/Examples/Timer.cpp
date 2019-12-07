#include <emscripten.h>
#include <stdio.h>

int counter = 0;

void timer(void *) {
  printf("counter %p: %03d\n", &counter, counter++);
  emscripten_async_call(timer, nullptr, 1000);
}

int main() { timer(nullptr); }
