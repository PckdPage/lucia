import axios from "axios";
import { useQuery } from "@tanstack/react-query"; //manages asynchronous state
import { useNavigate } from "react-router-dom";
import HomeLoggedIn from "../components/main/HomeLoggedIn";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";

const Home = () => {
  const navigate = useNavigate();
  const { isError, isLoading } = useQuery({ // verifies if the user is logged in or not 
    queryKey: ["verify"],
    queryFn: async () => {
      await axios.get(`${import.meta.env.VITE_BACKEND_URL}/auth/verify`, {
        withCredentials: true,
      });
      return true;
    },
    retry: false,
  });

  return (
    <>
      {!isLoading && isError ? (
        <>
          <div className="min-h-screen bg-black text-white">
            <motion.section
              initial={{ opacity: 0, y: -50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="flex flex-col items-center justify-center px-6 py-32 text-center  bottom-0 left-0 right-0 top-0 bg-[linear-gradient(to_right,#4f4f4f2e_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f2e_1px,transparent_1px)] bg-[size:100px_100px] "
            >
              <h1 className="text-6xl md:text-7xl font-bold mb-6 text-transparent bg-clip-text bg-gradient-to-br from-indigo-400 via-purple-400 to-pink-400">
                Lucia To-Do
              </h1>
              <p className="text-2xl md:text-3xl max-w-3xl mb-8 text-gray-300">
                Organize your life beautifully. Track tasks, set reminders, and
                boost productivity with ease.
              </p>
              <Button
                className="px-8 py-6 text-lg md:text-xl bg-indigo-600 hover:bg-indigo-700 cursor-pointer"
                onClick={() => navigate("/login")}
              >
                Get Started
              </Button>
            </motion.section>

            <motion.section
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
              className="bg-gray-900 py-24"
            >
              <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-12 px-6">
                {["Smart Reminders", "Categorized Lists", "Seamless UX"].map(
                  (title, index) => (
                    <motion.div
                      key={index}
                      whileHover={{ scale: 1.05 }}
                      className="bg-gray-800 p-8 rounded-2xl shadow-lg"
                    >
                      <h3 className="text-2xl font-semibold mb-3 text-indigo-400">
                        {title}
                      </h3>
                      <p className="text-gray-400 text-lg">
                        {title === "Smart Reminders"
                          ? "Get reminded before tasks are due with timezone-aware alerts."
                          : title === "Categorized Lists"
                          ? "Separate tasks by Work, Personal, Shopping, and more."
                          : "Designed for simplicity with responsive design and fast performance."}
                      </p>
                    </motion.div>
                  )
                )}
              </div>
            </motion.section>

            <motion.section
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.6 }}
              viewport={{ once: true }}
              className="py-24 text-center bg-black"
            >
              <h2 className="text-4xl md:text-5xl font-bold mb-6 text-white">
                Ready to take control?
              </h2>
              <p className="text-gray-400 text-xl mb-8">
                Join thousands already using Lucia To-Do.
              </p>
              <Button
                size="lg"
                className="text-xl px-8 py-6 bg-purple-600 hover:bg-purple-700 cursor-pointer"
                onClick={() => navigate("/login")}
              >
                Create Your Free Account
              </Button>
            </motion.section>
          </div>
          {/* <button
            className="border-8 cursor-pointer"
            onClick={() => navigate("/login")}
          >
            Login
          </button> */}
        </>
      ) : (
        <HomeLoggedIn />
      )}
    </>
  );
};

export default Home;
