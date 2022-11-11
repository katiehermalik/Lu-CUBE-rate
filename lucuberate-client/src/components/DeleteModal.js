import React, { useContext } from "react";
import { withRouter } from "react-router-dom";
import {
  UserContext,
  CubeContext,
  CategoryContext,
} from "../context/ContextProvider";
import CubeModel from "../models/cube";
import CategoryModel from "../models/category";
import UserModel from "../models/user";

const DeleteModal = ({
  cubeId,
  showModal,
  setShowModal,
  type,
  categoryId,
  categoryTitle,
  history,
}) => {
  const { currentUserInfo, setCurrentUserInfo } = useContext(UserContext);
  const { setCurrentCubeId } = useContext(CubeContext);
  const { setCurrentCategory } = useContext(CategoryContext);

  const closeModal = e => {
    e.stopPropagation();
    e.preventDefault();
    setShowModal(false);
  };

  const handleDeleteCategory = async e => {
    e.stopPropagation();
    await history.push("/dashboard");
    await CategoryModel.delete(categoryId);
    const categoriesAndCubes = await UserModel.allCubesAndCategories(
      currentUserInfo._id
    );
    setCurrentCubeId("");
    setCurrentCategory(null);
    setCurrentUserInfo({
      ...categoriesAndCubes,
      user_id: currentUserInfo._id,
    });
  };

  const handleDeleteCube = async e => {
    e.stopPropagation();
    await history.push("/dashboard");
    setCurrentCubeId("");
    await CubeModel.delete(cubeId);
    const categoriesAndCubes = await UserModel.allCubesAndCategories(
      currentUserInfo._id
    );
    setCurrentUserInfo({
      ...categoriesAndCubes,
      user_id: currentUserInfo._id,
    });
  };

  return (
    <>
      {showModal && (
        <div
          onClick={closeModal}
          onMouseDown={closeModal}
          className="modal"
          id="deleteConfirmModal"
          tabIndex="-1"
          role="dialog"
          aria-labelledby="exampleModalLabel"
          aria-hidden="true">
          <div className="modal-dialog" role="document">
            <div className="modal-content">
              <div
                className="modal-header"
                onClick={e => e.stopPropagation()}
                onMouseDown={e => e.stopPropagation()}>
                <h4 className="modal-title" id="exampleModalLabel">
                  {type === "category" && `Delete '${categoryTitle}' Category`}
                  {type === "cube" && "Delete Cube"}
                  {type === "warning" && "Move last cube from category?"}
                </h4>
                <button
                  type="button"
                  onClick={closeModal}
                  className="close"
                  data-dismiss="modal"
                  aria-label="Close">
                  <span aria-hidden="true">&times;</span>
                </button>
              </div>
              <div
                className="modal-body"
                onClick={e => e.stopPropagation()}
                onMouseDown={e => e.stopPropagation()}>
                {type === "category" && (
                  <>
                    All the cubes within this category will be deleted as well.
                    <br />
                    <br />
                    Are you sure you want to delete this category?
                  </>
                )}
                {type === "cube" &&
                  "Are you sure you want to delete this cube?"}
                {type === "warning" && (
                  <>
                    {`This is the last cube in the '${categoryTitle}' category!`}
                    <br />
                    <br />
                    {`If you choose to move this cube, the '${categoryTitle}' category will be deleted upon saving.`}
                  </>
                )}
              </div>
              <div
                className="modal-footer"
                onClick={e => e.stopPropagation()}
                onMouseDown={e => e.stopPropagation()}>
                {(type === "category" || type === "cube") && (
                  <input
                    type="button"
                    value="Cancel"
                    onClick={closeModal}
                    className="form-btn btn-secondary"
                  />
                )}
                <input
                  onClick={
                    (type === "category" && handleDeleteCategory) ||
                    (type === "cube" && handleDeleteCube) ||
                    (type === "warning" && closeModal)
                  }
                  type="button"
                  value={
                    type === "category" || type === "cube"
                      ? "Delete"
                      : "Continue"
                  }
                  className="form-btn btn-danger"
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default withRouter(DeleteModal);
