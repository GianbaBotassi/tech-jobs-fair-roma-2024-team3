import { Fragment, useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import useAuth from "../hooks/useAuth"
import { FiPlus } from "react-icons/fi"
import Spinner from "./Spinner"
import Header from "./Header"
import { Task } from "../types"
import Input from "./Input"

const tasks = [
    {
        id: "1",
        name: "Bere acqua",
        done: false
    },
    {
        id: "2",
        name: "Camminare",
        done: false
    },
    {
        id: "3",
        name: "Studiare",
        done: true
    },
    {
        id: "4",
        name: "Coding",
        done: false
    }
]

const Home = () => {
    const [isOpen, setIsOpen] = useState<boolean>(false)
    const [selectedTask, setSelectedTask] = useState<Task | null>(null)
    const [currentTasks, setCurrentTasks] = useState<Task[]>(tasks)
    const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined)
    const { user, login, loading, logout } = useAuth()
    const navigate = useNavigate()
    const [startDate, setStartDate] = useState<Date>(new Date());

    console.log(setCurrentTasks)

    const generateDates = (start: Date) => {
        const dates = [];
        for (let i = 0; i < 5; i++) {
            const date = new Date(start);
            date.setDate(start.getDate() + i);
            dates.push(date);
        }
        return dates;
    };

    const handlePrev = () => {
        const newStartDate = new Date(startDate);
        newStartDate.setDate(startDate.getDate() - 5);
        setStartDate(newStartDate);
    };

    const handleNext = () => {
        const newStartDate = new Date(startDate);
        newStartDate.setDate(startDate.getDate() + 5);
        setStartDate(newStartDate);
    };

    const dates = generateDates(startDate);

    useEffect(() => {
        const token = localStorage.getItem("token");

        const getUser = async () => {
            if (token && !user) {
                try {
                    const newToken = await login(undefined, token);
                    localStorage.setItem("token", newToken)
                } catch (err) {
                    console.log(err)
                    navigate("/")
                }
            }
            if (!token || !user) {
                navigate("/");
            }
        };

        getUser();
    }, [login, navigate, user]);

    if (loading) {
        return (
            <div className="min-h-screen w-full flex justify-center items-center">
                <Spinner isInverted />
            </div>
        )
    }

    return (
        <Fragment>
            <div className="flex-1 flex justify-center items-center">
                <div className="relative  min-h-screen max-w-[600px] flex flex-col w-full border-x-[1px] border-gray-200">
                    <Header logout={logout} navigate={() => navigate("/")} username={user?.name} />
                    <div className="flex justify-center items-center flex-col gap-2 mt-4">
                        <p>{startDate.toLocaleString('default', { month: 'long' })}</p>
                        <div className="flex items-center justify-center w-full">
                            <button
                                onClick={handlePrev}
                                className="text-xl w-[40px] h-[40px] bg-gray-200 rounded-full hover:bg-gray-300 text-center"
                            >
                                ←
                            </button>
                            <div className="flex gap-1 px-2">
                                {dates.map((date, index) => {
                                    const isToday = date.toDateString() === new Date().toDateString()
                                    const isClicked = date.toDateString() === selectedDate?.toDateString()
                                    return (
                                        <button key={index} onClick={() => setSelectedDate(date)} className={`text-center w-[50px] h-[70px] rounded-full ${isToday || (isToday && isClicked) ? "bg-blue-500 text-white" : ""} ${isClicked && !isToday ? 'border-blue-500 bg-white text-blue-500 border-[1px]' : ''} `}>
                                            <div className="font-bold">{date.getDate()}</div>
                                            <div className="text-xs">{date.toLocaleString('default', { weekday: 'short' })}</div>
                                        </button>
                                    )
                                })}
                            </div>
                            <button
                                onClick={handleNext}
                                className="text-xl w-[40px] h-[40px] bg-gray-200 rounded-full hover:bg-gray-300"
                            >
                                →
                            </button>
                        </div>
                    </div>
                    <div className="mt-8 px-4">
                        {currentTasks.map((t) => {
                            return (
                                <div key={t.id} onClick={() => setSelectedTask(t)} className={`${t.done ? "line-through bg-blue-500 text-white" : "bg-white border-blue-500 text-blue-500"} font-medium p-4 w-full border-[1px] rounded-md shadow-lg mt-4 cursor-pointer`}>
                                    <p>{t.name}</p>
                                </div>
                            )
                        })}
                    </div>

                    <button
                        type="button"
                        onClick={() => {
                            if (selectedTask) {
                                setSelectedTask(null)
                            } else {
                                setIsOpen((prev) => !prev)
                            }
                            // setCurrentTasks((prev) => ([...prev, {
                            //     id: 5,
                            //     name: "Test",
                            //     done: false
                            // }]))
                        }}
                        className={`fixed md:absolute flex justify-center items-center shadow-xl bottom-6 right-6 rounded-full
                            ${(isOpen || selectedTask)
                                ? "bg-red-500 transition duration-300 ease-in-out transform rotate-45"
                                : "bg-blue-500 transition duration-300 ease-in-out transform rotate-0"
                            } text-white z-30 w-[70px] h-[70px]`}
                    >
                        <FiPlus size={35} />
                    </button>
                </div>
            </div>
            {(isOpen || selectedTask) && (
                <Fragment>
                    <div className="absolute top-0 left-0 w-full h-screen z-10 bg-black opacity-30" />
                    <div className="absolute top-0 left-0 w-full h-screen flex justify-center items-center z-20">
                        <div className="bg-white p-4 rounded-lg shadow-lg w-96">
                            <h2 className="text-2xl font-bold mb-6 text-center">
                                {selectedTask ? `Update ${selectedTask.name}` : 'Add new task'}
                            </h2>

                            <div className="mb-4">
                                <Input id="name" name="name" label="Name" placeholder="Enter task name" onChange={() => console.log()} />
                            </div>

                            <div className="mb-4">
                                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="password">
                                    Pick a date
                                </label>
                            </div>

                            <div className="mb-4">
                                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="confirm-password">
                                    Recursive
                                </label>
                                {/* <select
                                id="recursive"
                                name="recursive"
                                value={signUpDetails.confirmPassword}
                                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                placeholder="Confirm your password"
                                onChange={(e) => handleInput(e.currentTarget.name, e.currentTarget.value)}
                            /> */}
                            </div>

                            <button
                                // disabled={loading}
                                className="bg-blue-500 md:hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline w-full flex justify-center items-center"
                            // onClick={handleAuth}
                            >
                                {/* {loading ? <Spinner /> : isLogin ? 'Login' : 'Sign Up'} */}
                                {selectedTask ? 'Update' : 'Create'}
                            </button>
                        </div>
                    </div>
                </Fragment>
            )}
        </Fragment>
    )
}

export default Home