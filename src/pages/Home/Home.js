//lib


//file
import Header from "../../components/Header/Header";

//fake data
const dataFake = [
  {
    subjects: "Toán",
    item: ["Toán 10", "Toán 11", "Toán 12"],
  },
  {
    subjects: "Văn",
    item: ["Văn 10", "Văn 11", "Văn 12"],
  },
];

function Home() {
  return (
    <div>
      <Header data={dataFake}/>
    </div>
  );
}

export default Home;
