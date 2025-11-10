import Layout from "@/components/Layout";
import  FamilyTreeComponent  from "../components/FamilyTreeComponent";

type Props = {
  id:number;
}
const Tree = ({id}:Props) => {
  return (
    <Layout>
      <FamilyTreeComponent id={id} />
    </Layout>
  );
};

export default Tree;
