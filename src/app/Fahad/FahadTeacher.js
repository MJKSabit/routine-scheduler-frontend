

export default function FahadTeacher({ teacher, ongo }) {

    console.log(ongo);
    console.log()

    return (
            <div className="col-8 grid-margin">
                {teacher && (

                    <div className="card">
                        <div className="card-body">
                            <div className="table-responsive">
                                <table className="table">
                                    <tbody>
                                        <tr>
                                            <td > Name</td>
                                            <td> {teacher.name} </td>
                                        </tr>
                                        <tr>
                                            <td > Surname</td>
                                            <td> {teacher.surname} </td>
                                        </tr>
                                        <tr>
                                            <td > Email</td>
                                            <td> {teacher.email} </td>
                                        </tr>
                                        <tr>
                                            <td > Active</td>
                                            <td> {teacher.active} </td>
                                        </tr>
                                        <tr>
                                            <td > Seniority Rank</td>
                                            <td> {teacher.seniority_rank} </td>
                                        </tr>
                                        <tr>
                                            <td > 	Theory Courses </td>
                                            <td> {teacher.theory_courses} </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                )
                }
            </div>

    )

}