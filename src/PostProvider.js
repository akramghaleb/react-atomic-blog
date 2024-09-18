import { createContext, useContext, useMemo, useState } from "react";
import { faker } from "@faker-js/faker";

function createRandomPost() {
    return {
        title: `${faker.hacker.adjective()} ${faker.hacker.noun()}`,
        body: faker.hacker.phrase(),
    };
}

// 1- CREATE A NEW CONTEXT
const PostContext = createContext()

function PostProvider({ children }) {
    const [posts, setPosts] = useState(() =>
        Array.from({ length: 30 }, () => createRandomPost())
    );
    const [searchQuery, setSearchQuery] = useState("");

    const [archivedPosts] = useState(() =>
        // 💥 WARNING: This might make your computer slow! Try a smaller `length` first
        Array.from({ length: 10000 }, () => createRandomPost())
    );

    // Derived state. These are the posts that will actually be displayed
    const searchedPosts =
        searchQuery.length > 0
            ? posts.filter((post) =>
                `${post.title} ${post.body}`
                    .toLowerCase()
                    .includes(searchQuery.toLowerCase())
            )
            : posts;

    function handleAddPost(post) {
        setPosts((posts) => [post, ...posts]);
    }

    function handleClearPosts() {
        setPosts([]);
    }

    const value = useMemo(() => {
        return {
            posts: searchedPosts,
            onAddPost: handleAddPost,
            onClearPosts: handleClearPosts,
            searchQuery,
            setSearchQuery,
            archivedPosts
        }
    }, [searchedPosts, searchQuery, archivedPosts])

    // 2- PROVIDE VALUE TO CHILD COMPONENTS
    return <PostContext.Provider value={value}>
        {children}
    </PostContext.Provider>
}

function usePosts() {
    const context = useContext(PostContext)
    if (context === undefined)
        throw new Error("PostContext was used outside of the PostProvider")
    return context
}

export { PostProvider, usePosts }