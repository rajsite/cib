// cib:{"fetch":"armadillo-9.200.7.zip", "system_includes":["include"], "unzip_compiler":true}

extern "C" void loadInput(const char* name, void* start, int size);
extern "C" void saveResult(const char* name, void* start, int size);

#include <armadillo>
#include <stdio.h>

using namespace std;
using namespace arma;

int main() {
    vec X(100,fill::zeros);
    loadInput("X", X.memptr(), X.size());

    cx_vec Y = fft(X, 128);
    mat B = real(Y);

    saveResult("B", B.memptr(), B.size());
}
