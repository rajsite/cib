// cib:{"fetch":"armadillo-9.200.7.zip", "system_includes":["include"], "unzip_compiler":true}
// cib:{"fetch":"sigpack-1.2.5.zip", "system_includes":["sigpack-1.2.5/sigpack"], "unzip_compiler":true}
#define ARMA_DONT_USE_LAPACK
#define ARMA_DONT_USE_BLAS
#define ARMA_DONT_USE_NEWARP
#define ARMA_DONT_USE_ARPACK
#define ARMA_DONT_USE_SUPERLU
#define ARMA_DONT_USE_HDF5
#define ARMA_DONT_USE_OPENMP

extern "C" void saveResult(const char* name, void* start, int size);

#include "sigpack.h"

using namespace std;
using namespace arma;
using namespace sp;

int main() {
    int N = 15;
    vec X(N,fill::zeros);  // Input sig
    X[0] = 1;  // Impulse

    // Create a FIR filter
    // http://sigpack.sourceforge.net/doxy/html/group__filter.html
    vec B = fir1(7,0.35);

    // Filter the input signal
    vec Y = conv(X, B);

    saveResult("X", X.memptr(), X.size());
    saveResult("Y", Y.memptr(), Y.size());
}