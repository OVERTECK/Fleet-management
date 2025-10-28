namespace Backend.DataAccess.Entities;

public class RouteEntity
{
    public Guid Id { get; set; }

    public DateTime Start { get; set; }

    public DateTime End { get; set; }

    public int CountKM { get; set; }
}