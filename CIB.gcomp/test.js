(async function () {
    'use strict';

window.source_helloworld = String.raw`
#include <stdio.h>


int main() {
  printf("hello world!\n");
}
`

window.source_emscriptentimer = String.raw`
#include <emscripten.h>
#include <stdio.h>

int counter = 0;

void timer(void *) {
  printf("counter %p: %03d\n", &counter, counter++);
  emscripten_async_call(timer, nullptr, 1000);
}

int main() { timer(nullptr); }
`

window.source_emscriptenidbstore = String.raw`
#include <emscripten.h>


int main() {
  int hello = 7;
  emscripten_idb_async_store("THE_DB", "the_secret", &hello, sizeof(int), 0, 0, 0);
  return 0;
}
`



window.source_filewrite = String.raw`
#include <stdio.h>
#include <stdlib.h>

int main () {
   FILE * fp;

   fp = fopen ("file.txt", "w+");
   fprintf(fp, "%s %s %s %d", "We", "are", "in", 2012);
   
   fclose(fp);
   
   return(0);
}
`


window.source_emscriptenrunscript = String.raw`
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
`



window.source_range = String.raw`
// cib:{"fetch":"range-v3-0.3.0.zip", "system_includes":["range-v3-0.3.0/include"], "unzip_compiler":true}

#include <iostream>
#include <range/v3/all.hpp>
#include <stdio.h>

using namespace ranges;

int main()
{
    // Define an infinite range containing all the Pythagorean triples:
    auto triples =
        view::for_each(view::ints(1), [](int z)
        {
            return view::for_each(view::ints(1, z+1), [=](int x)
            {
                return view::for_each(view::ints(x, z+1), [=](int y)
                {
                    return yield_if(x*x + y*y == z*z, std::make_tuple(x, y, z));
                });
            });
        });

    //// This alternate syntax also works:
    //auto triples = view::ints(1)      >>= [] (int z) { return
    //               view::ints(1, z+1) >>= [=](int x) { return
    //               view::ints(x, z+1) >>= [=](int y) { return
    //   yield_if(x*x + y*y == z*z,
    //       std::make_tuple(x, y, z)); };}; };

    // Display the first 100 triples
    RANGES_FOR(auto triple, triples | view::take(100))
    {
        printf("(%d,%d,%d)\n", std::get<0>(triple), std::get<1>(triple),std::get<2>(triple));
    }
}
`


window.source_armadillo = String.raw`
// cib:{"fetch":"armadillo-9.200.7.zip", "system_includes":["include"], "unzip_compiler":true}

#define ARMA_DONT_USE_LAPACK
#define ARMA_DONT_USE_BLAS
#define ARMA_DONT_USE_NEWARP
#define ARMA_DONT_USE_ARPACK
#define ARMA_DONT_USE_SUPERLU
#define ARMA_DONT_USE_HDF5
#define ARMA_DONT_USE_OPENMP


#include <iostream>
#include <armadillo>
#include <stdio.h>

using namespace std;
using namespace arma;

int main()
  {

  mat A = randu<mat>(4,5);
  mat B = randu<mat>(4,5);
  printf("%f\n", A[1]);
  return 0;
  }
`


// From the process-runtime worker:
// emModule.FS.readFile('/file.txt', { encoding: 'utf8' })


const [compilerRefnum, runtimeRefnum] = await Promise.all([
    window.cib_wrapper.createCompiler(),
    window.cib_wrapper.createRuntime()
]);

// const wasm = await window.cib_wrapper.executeCompiler(compilerRefnum, source);
// await window.cib_wrapper.executeRuntime(runtimeRefnum, wasm);

window.compileAndRun = async function (source) {
    const wasm = await window.cib_wrapper.executeCompiler(compilerRefnum, source);
    await window.cib_wrapper.executeRuntime(runtimeRefnum, wasm);
    window.runtimeRefnum = runtimeRefnum;
};

}());
