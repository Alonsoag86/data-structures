For this assignment I intend to use the sensors (piezo, potentiometer) to keep track of my sleeping habits.

I decided to create two tables, one for each sensor. 

The potentiometer will be used to register everytime I wake up on time. the table for this sensor will have three columns:

1)id integer (a simple way to keep track of the number of times I wake up on time)
2) value integer (for the purpose of this project I'm not so sure that I need this column) 
3) time (register the day and time when I wake up on time)

I intend to use the piezo for everytime I hit the snooze button. For this, I'm going to reduce the sensibility of the sensor so
it'll be easier to register every knock. The piezo table only has two values:

1) id integer (a simple way to keep track of the number of times I don't wake up on time)
2) time (for everytime I hit the snooze button, the piezo will register that action as the day and time I did so).

I'm still wondering if I need two tables, specially if I end up with two values for the potentiometer.
For the moment my sql project looks like the png image in this folder.

