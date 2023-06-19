const Header = ( { course } ) => <h2>{course.name}</h2>
const Part = ( { part } ) => 
  <p>
    {part.name} {part.exercises}
  </p>
const Content = ( { course } ) => 
  <>
    {course.parts.map(part =>
      <Part key={part.id} part={part}/>
      )
    }
  </>
const Total = ( {course } ) => {
  return (
  <p>
    <b>
      Total of {course.parts.reduce((acc,cur) => {
        return acc+cur.exercises
      }, 0)} exercises
    </b>
  </p>
  )}
const Course = ( {course} ) =>
  <div>
    <Header course={course} />      
    <Content course={course} />
    <Total course={course} />
  </div>

export default Course