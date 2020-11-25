#!/bin/bash


#account and group creation
groupadd hod
groupadd prof1
groupadd prof2
STUDENTLIST=$(
		for((VAR=1; VAR <= 19; VAR++))
		do
			printf "student%d," "${VAR}"
		done
		printf "student20"
		)


for((VAR=1; VAR <= 20; VAR++))
do
	groupadd student${VAR}
	useradd student${VAR} -g student${VAR} -m -s /bin/bash
	echo -e "student${VAR}\nstudent${VAR}"|passwd student${VAR}
done

for((VAR=1; VAR <= 2; VAR++))
do
	useradd prof${VAR} -g prof${VAR} -G ${STUDENTLIST} -m -s /bin/bash
	echo -e "prof${VAR}\nprof${VAR}"|passwd prof${VAR}
done

useradd hod -g hod -G prof1,prof2,${STUDENTLIST} -m -s /bin/bash
echo -e "hod\nhod"|passwd hod




#userpermissions
cd /home/

for((VAR=1; VAR <= 20; VAR++))
do
	setfacl -Rn -m default:g:student${VAR}:rwx,o::--- student${VAR}/

done

setfacl -Rn -m default:g:prof1:rwx,o::--- prof1/
setfacl -Rn -m default:g:prof2:rwx,o::--- prof2/
setfacl -Rn -m default:g:hod:rwx,o::--- hod/

#makingdirectories

cd /home/
for((VAR=1; VAR <= 20; VAR++))
do
	mkdir student${VAR}/HomeWork
done

mkdir prof1/Teaching_Material
mkdir prof2/Teaching_Material


#generating random questions
cd /home/prof1/Teaching_Material
for((VAR=1; VAR <= 50; VAR++))
do
	touch q${VAR}.txt
	pwgen 100 1 >q${VAR}.txt
done


cd /home/prof2/Teaching_Material
for((VAR=1; VAR <= 50; VAR++))
do
	touch q${VAR}.txt
	pwgen 100 1 >q${VAR}.txt
done



#copying questions to student directories

cd /home/
for((VAR=1; VAR <= 20; VAR++))
do
	cd student${VAR}/
	mkdir prof1_work
	ls /home/prof1/Teaching_Material/ | sort -R| tail -5 | while read file;
	do
		cp /home/prof1/Teaching_Material/$file ./prof1_work
	done
	mkdir prof2_work
	ls /home/prof2/Teaching_Material/ | sort -R| tail -5 | while read file;
	do
		cp /home/prof2/Teaching_Material/$file ./prof2_work
	done
 	cd ..
done


#hacker mode starts here
#download file and make questions from it

cd /home/
cd prof1/Teaching_Material
ls |xargs rm
wget http://inductions.delta.nitt.edu/dataStructure.txt
PD="$(pwd)"
while read -r LINE; do
	if [[ $LINE =~ ^\*\* ]]
	then
		cd $PD
		TEMP=$(cut -f2- -d ' ' <<< $LINE)
		TEMP2=$(sed 's/ //g' <<< $TEMP)
		mkdir $TEMP2
		cd $TEMP2
		VAR=1;
		
	elif [[ $LINE =~ ^- ]]
	then
		TEMP=$(cut -f2- -d ' ' <<< $LINE)
		echo $TEMP > q${VAR}.txt
		((VAR=VAR+1))
	fi
	
done < dataStructure.txt
cd $PD
rm dataStructure.txt


cd /home/
cd prof2/Teaching_Material
ls |xargs rm
wget http://inductions.delta.nitt.edu/algorithm.txt
PD="$(pwd)"
while read -r LINE; do
	if [[ $LINE =~ ^\*\* ]]
	then
		cd $PD
		TEMP=$(cut -f2- -d ' ' <<< $LINE)
		TEMP2=$(sed 's/ //g' <<< $TEMP)
		mkdir $TEMP2
		cd $TEMP2
		VAR=1;
		
	elif [[ $LINE =~ ^- ]]
	then
		TEMP=$(cut -f2- -d ' ' <<< $LINE)
		echo $TEMP > q${VAR}.txt
		((VAR=VAR+1))
	fi
	
done < algorithm.txt
cd $PD
rm algorithm.txt



#scheduling transfer of files
TOTAL=0;
crontab scheduler.txt



