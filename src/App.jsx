import { useRoutes } from 'react-router-dom';
import { ChakraProvider } from '@chakra-ui/react';
import { Toaster } from 'react-hot-toast';
import { Suspense } from 'react';
import Loading from './components/Loading';
import routes from './Routes';
import theme from './resources/index'

function App() {


  let element = useRoutes(routes);

  return (
    <>
      <ChakraProvider theme={theme} >
        <Suspense fallback={ <Loading/> } >
          {element}
        </Suspense>
        <Toaster
          position='bottom-top-center'
          reverseOrder={false}
        />
      </ChakraProvider>
    </>
  )
}

export default App
