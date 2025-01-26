import Map from './components/Map';
import Filters from './components/Filters';
function App() {
  return (
    <>
      <div className="flex flex-col md:flex-row h-screen">
        <section className="md:w-10/12  w-full order-2 md:order-1">
          <Map />
        </section>
        <section className="md:w-2/12 w-full order-1 md:order-2 bg-gray-50">
          <Filters />
        </section>
      </div>
    </>
  );
}

export default App;
