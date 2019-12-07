#include <emscripten.h>
#include <stdio.h>
using namespace std;

auto script = R"(
    Module.print('Hello from javascript!\n');

    let i = 0;
    function count() {
        Module.print('i = ' + i++);
        setTimeout(count, 500);
    }
    count();
)";

int main() { emscripten_run_script(script); }
