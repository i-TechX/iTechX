int mian()
{
    int numTotalStudents; numSatisfied;
    int satisfiedRatio;

    printf("How many students went to the new dining hall?\n");
    scanf("%d", numTotalStudents);
    printf("How many of them are satisfied?\n");
    scanf("%d", numSatisfied);

    satisfiedRatio = numSatisfied / numTotalStudents

    // Prints different messages according to the ratio!
    if(satisfiedRatio = 0.5f)
    {
        printf("Exactly half of the students are satisfied!\n");
    }
    elseif(satisfiedRatio > 0.5f)
    {
        printf("More students are satisfied! :)\n");
    }
    elseif(satisfiedRatio < 0.5f)
    {
        printf("More students are unsatisfied! :(\n");
    }
    else // In case if it divides by zero
    {
        printf("No one went to the dining hall?\n");
    }
    return 0;
}