/* eslint-disable react-refresh/only-export-components */
/* eslint-disable react/prop-types */
import { createContext, useContext, useState } from "react";
import { supabase } from "@/Supabase-BD/Client";

export const PostContext = createContext();

export const usePosts = () => {
  const context = useContext(PostContext);
  if (!context)
    throw new Error("usePosts  debe estar dentro de un Context Provider");
  return context;
};

export const PostContextProvider = ({ children }) => {
  const [posts, setPosts] = useState([]);
  const [acceptedPosts, setAcceptedPosts] = useState([]);

  const [postsF, setPostsF] = useState([]);
  const [acceptedPostsF, setAcceptedPostsF] = useState([]);

  const getPostsE = async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    const id = await supabase
      .from("perfil_empleador")
      .select()
      .eq("id_empleador", user.id);
    const { data, error } = await supabase
      .from("Posts")
      .select()
      .eq("id_perfil", id.data[0].id);
    if (error) throw error;
    setPosts(data);
  };

  const getAcceptedPosts = async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    const id = await supabase
      .from("perfil_empleador")
      .select()
      .eq("id_empleador", user.id);

    const { data, error } = await supabase.rpc("obtener_posts_aceptados", {
      employer_id: id.data[0].id,
    });
    if (error) throw error;
    console.log(data);
    setAcceptedPosts(data);
  };

  const delAcceptedPost = async (id) => {
    const { error } = await supabase
      .from("post_aceptado")
      .delete()
      .eq("id", id)
      .select();

    if (error) throw error;
    console.log("Borrado");
    setAcceptedPosts(acceptedPosts.filter((post) => post.post_id != id));
    setAcceptedPostsF(acceptedPostsF.filter((post) => post.post_id != id));
  };

  const addPost = async (updateFields) => {
    const { data, error } = await supabase
      .from("Posts")
      .insert(updateFields)
      .select();

    if (error) throw error;

    setPosts([...posts, ...data]);

    return { error };
  };

  const deletePost = async (id) => {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    const { data } = await supabase
      .from("perfil_empleador")
      .select()
      .eq("id_empleador", user.id);
    console.log(data[0].id);

    const { error } = await supabase
      .from("Posts")
      .delete()
      .eq("id_perfil", data[0].id)
      .eq("id", id)
      .select();

    if (error) throw error;

    setPosts(posts.filter((post) => post.id != id));
  };

  const updatePost = async (id, updateFields) => {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    const { data: perfilData } = await supabase
      .from("perfil_empleador")
      .select()
      .eq("id_empleador", user.id);

    const { error, data: updatedData } = await supabase
      .from("Posts")
      .update(updateFields)
      .eq("id_perfil", perfilData[0].id)
      .eq("id", id)
      .select();

    if (error) throw error;

    setPosts((prevPosts) =>
      prevPosts.map((post) => (post.id === id ? updatedData[0] : post))
    );

    return error;
  };

  const updateProfile = async (id, updateFields) => {
    const { error, data } = await supabase
      .from("perfil_empleador")
      .update(updateFields)
      .eq("id", id)
      .select();

    if (error) throw error;

    console.log(data);
  };

  //METODOS API PARA FREELANCER
  const getPosts = async () => {
    const { data, error } = await supabase.from("Posts").select();
    if (error) throw error;
    console.log(data);
    setPostsF(data);
  };

  const addAcceptedPost = async (dataFields) => {
    const { error } = await supabase.from("post_aceptado").insert(dataFields);

    if (error) throw error;
  };

  const getAcceptedPostsF = async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    const id = await supabase
      .from("perfil_freelancer")
      .select()
      .eq("id_freelancer", user.id);

    const { data, error } = await supabase
      .rpc("obtener_posts_aceptados_f", {
        freelancer_id: id.data[0].id,
      })
      .select();
    if (error) throw error;
    setAcceptedPostsF(data);
  };

  const updateProfileF = async (id, updateFields) => {
    const { error, data } = await supabase
      .from("perfil_freelancer")
      .update(updateFields)
      .eq("id", id)
      .select();

    if (error) throw error;

    console.log(data);
  };


  return (
    <PostContext.Provider
      value={{
        posts,
        acceptedPosts,
        getPostsE,
        getAcceptedPosts,
        addPost,
        deletePost,
        updatePost,
        updateProfile,
        delAcceptedPost,
        getPosts,
        postsF,
        addAcceptedPost,
        acceptedPostsF,
        getAcceptedPostsF,
        updateProfileF,
      }}
    >
      {children}{" "}
    </PostContext.Provider>
  );
};
