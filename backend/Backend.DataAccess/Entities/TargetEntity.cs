namespace Backend.DataAccess.Entities;

public class TargetEntity
{
    public Guid Id { get; set; }

    public CarEntity Car { get; set; }

    public DriverEntity Driver { get; set; }

    public DateTime Start { get; set; }

    public DateTime End { get; set; }
}