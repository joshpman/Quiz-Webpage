const Categories = ({type})=>{
    return(
        <option  value={type.id}>{type.name}</option>
    )
}
export default Categories;

