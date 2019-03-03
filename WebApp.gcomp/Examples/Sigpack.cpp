// cib:{"fetch":"armadillo-9.200.7.zip", "system_includes":["include"], "unzip_compiler":true}
// cib:{"fetch":"sigpack-1.2.5.zip", "system_includes":["sigpack-1.2.5/sigpack"], "unzip_compiler":true}

extern "C" void saveResult(const char* name, void* start, int size);

#include "sigpack.h"

using namespace std;
using namespace arma;
using namespace sp;

int main() {
    vec b;
    int N = 15;
    vec X(N,fill::zeros);  // Input sig
    vec Y(N,fill::zeros);  // Output sig

    // Create a FIR filter
    FIR_filt<double,double,double> fir_filt;
    b = fir1(7,0.35);
    fir_filt.set_coeffs(b);
    X[0] = 1;  // Impulse

    // Filter the input signal
    Y = fir_filt.filter(X);

    saveResult("X", X.memptr(), X.size());
    saveResult("Y", Y.memptr(), Y.size());
}