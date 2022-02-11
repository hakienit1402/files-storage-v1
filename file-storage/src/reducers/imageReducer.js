const imageReducer = (state= { images: [] }, action) => {
    switch (action.type) {
      case "ADD_IMAGE":
        return state;
      case "DELETE_IMAGE":
        return state;
      
      default:
        return state;
    }
  };
  export default imageReducer;