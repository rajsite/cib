// cib:{"fetch":"armadillo-9.200.7.zip", "system_includes":["include"], "unzip_compiler":true}
#define ARMA_DONT_USE_LAPACK
#define ARMA_DONT_USE_BLAS
#define ARMA_DONT_USE_NEWARP
#define ARMA_DONT_USE_ARPACK
#define ARMA_DONT_USE_SUPERLU
#define ARMA_DONT_USE_HDF5
#define ARMA_DONT_USE_OPENMP

#include <armadillo>
#include <stdio.h>

using namespace std;
using namespace arma;

int main() {
    vec X = randu<vec>(100);
    cx_vec Y = fft(X, 128);
    
    mat B = real(Y);

    mat::iterator it = B.begin();
    mat::iterator it_end = B.end();

   for(; it != it_end; ++it) {
    printf("%f\n",*it);
   }


}
